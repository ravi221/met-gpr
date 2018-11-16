/**
 * 
 */
package com.metlife.us.ins.product.gprui;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This class contains all the properties for returning the error JSON response
 * to the consumers. This class will be populated by the
 * {@link com.metlife.us.ins.product.gpr.handlers.GPRRestExceptionHandler} and
 * returned as JSON response on encountering any exception.
 * 
 * @author Cognizant Technology Solutions
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class GPRError implements Serializable {

    /**
     * Auto-Generated Serial ID
     */
    private static final long serialVersionUID = 822159908846292145L;

    @JsonProperty("code")
    @XmlElement(name = "code")
    private String code;

    @JsonProperty("description")
    @XmlElement(name = "description")
    private String description;

    @JsonProperty("errors")
    @XmlElement(name = "errors")
    private List<String> errors;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("GPRError [\n");
        if (code != null) {
            builder.append("code=");
            builder.append(code);
            builder.append(",\n ");
        }
        if (description != null) {
            builder.append("description=");
            builder.append(description);
            builder.append(",\n ");
        }
        if (errors != null) {
            builder.append("errors=");
            builder.append(errors);
        }
        builder.append("\n]");
        return builder.toString();
    }

}
