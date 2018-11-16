/**
 * 
 */
package com.metlife.us.ins.product.gprui;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This class contains the attributes which will used for returning response to
 * the consumers. For addition of extra attributes, new beans can extend this
 * class to add more attributes.
 * 
 * @author Cognizant Technology Solutions
 */
@XmlRootElement(name = "GPRCommonResponse")
@XmlAccessorType(XmlAccessType.FIELD)
public class GPRCommonResponse implements Serializable {

    /**
     * Auto-Generated Serial ID
     */
    private static final long serialVersionUID = 4205493656530822485L;

    @JsonProperty("error")
    @XmlElement(name = "error")
    private GPRError error;

    public GPRError getError() {
        return error;
    }

    public void setError(GPRError error) {
        this.error = error;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("GPRCommonResponse [");
        if (error != null) {
            builder.append("error=");
            builder.append(error);
        }
        builder.append("]");
        return builder.toString();
    }
}
