package com.metlife.us.ins.product.gprui;

import static com.metlife.us.ins.product.gprui.GPRUIConstants.HOME_PAGE;
import static com.metlife.us.ins.product.gprui.GPRUIConstants.URL_PROTOCOL;
import static com.metlife.us.ins.product.gprui.GPRUIConstants.GET_ROLES_URI;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UrlPathHelper;
import org.apache.log4j.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GPRUISecurityFilter implements Filter {
	private FilterConfig config;
	final static Logger logger = Logger.getLogger(GPRUISecurityFilter.class);

	public GPRUISecurityFilter() {
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.config = filterConfig;
		config.getServletContext().log("Logs capturing started");
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws java.io.IOException, ServletException {

		HttpServletRequest req = null;
		HttpServletResponse res = null;
		req = (HttpServletRequest) request;
		res = (HttpServletResponse) response;

		String resourcePath = new UrlPathHelper().getPathWithinApplication(req);
    	logger.info("resourcePath ----------->"+resourcePath);

		if (homePageRequest(req, resourcePath)) {

			/** Retrieve user informations from request header **/
			String metnetId = req.getHeader("SM_USER");

			if (null != metnetId && metnetId.contains("@metnet")) {
				metnetId = metnetId.replace("@metnet", "");
			}

			String employeeId = req.getHeader("employeeID");
			String emailId = req.getHeader("mail");
			String firstName = req.getHeader("firstname");
			String lastName = req.getHeader("lastname");
			String metrefId = req.getHeader("metInternalRefID");
       		logger.info("employeeId ----------->"+employeeId);
        	logger.info("emailId ----------->"+emailId);
         	logger.info("firstName ----------->"+firstName);
          	logger.info("lastName ----------->"+lastName);
           	logger.info("metrefId ----------->"+metrefId);

		

			/** Invoking GPRUI REST service to fetch roles and authorize **/
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.set("UserId", metnetId);
			httpHeaders.set("metrefid", metrefId);
			httpHeaders.set("employeeid", employeeId);
			httpHeaders.set("emailid", emailId);
			httpHeaders.set("firstname", firstName);
			httpHeaders.set("lastname", lastName);
      		ResponseEntity<String> roleResponse = null;

			try {
				JSONObject json = new JSONObject();
				HttpEntity<String> httpEntity = new HttpEntity<String>(json.toString(), httpHeaders);
				roleResponse = restTemplate.postForEntity(URL_PROTOCOL + "localhost:35674" + GET_ROLES_URI, httpEntity, String.class);
				logger.info("status ----------->"+roleResponse);
				HttpStatus status = roleResponse.getStatusCode();
				logger.info("status ----------->"+status);
				String restCall = roleResponse.getBody();
				logger.info("restCall ----------->"+restCall);
			} catch (HttpClientErrorException e) {
				String responseString = e.getResponseBodyAsString();
				ObjectMapper mapper = new ObjectMapper();
				GPRCommonResponse result = mapper.readValue(responseString, GPRCommonResponse.class);
				res.setHeader("errorCode", result.getError().getCode());
				res.setHeader("errorMessage", result.getError().getDescription());
				res.sendRedirect(req.getContextPath() + "/error");
			} catch (Exception exe) {
				String exceptionString = exe.getMessage();
				res.setHeader("errorMessage", exceptionString);
				res.sendRedirect(req.getContextPath() + "/error");
			}

			req.getCookies();

			HttpHeaders headers = roleResponse.getHeaders();
			String gpruiRoles = headers.get("gprui-roles-" + metnetId).get(0);

			/** Set Get Roles in response header **/
			res.setHeader("gprui-roles-" + metnetId, gpruiRoles);

      res.setHeader("metnetId", metnetId);
			/** Get JWT Token from cookie **/
			String token = headers.getFirst(headers.SET_COOKIE);

			if (token.contains("jwt-token-" + metnetId)) {

				token = token.replace("jwt-token-" + metnetId + "=", "");

				Cookie jwtToken = new Cookie("jwt-token-" + metnetId, token);
				res.addCookie(jwtToken);
				Cookie metnetIdCookie = new Cookie("metnetId", metnetId);
				res.addCookie(metnetIdCookie);
			}
			chain.doFilter(request, response);
		} else {
			chain.doFilter(request, response);
		}
	}

	private boolean homePageRequest(HttpServletRequest httpRequest, String resourcePath) {
		return HOME_PAGE.equalsIgnoreCase(resourcePath);
	}

	public void destroy() {
	}
}
