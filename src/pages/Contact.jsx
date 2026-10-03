import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  AtSign, 
  PhoneCall, 
  FileText, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../components/SocialIcons";
import { personalInfo } from "../data/portfolioData";
import InputField from "../components/InputField";

export default function Contact() {
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, submitting, success, error
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [lastSubmission, setLastSubmission] = useState(null);

  // Field validation logic
  const validateField = (name, value) => {
    let error = "";
    const trimmed = (value || "").trim();

    switch (name) {
      case "name":
        if (!trimmed) {
          error = "Full name is required.";
        } else if (trimmed.length < 2) {
          error = "Name must be at least 2 characters.";
        }
        break;

      case "email":
        if (!trimmed) {
          error = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          error = "Please enter a valid email address (e.g., alex@domain.com).";
        }
        break;

      case "phone":
        if (trimmed) {
          // Normalize digits
          const digitsOnly = trimmed.replace(/\D/g, "");
          if (digitsOnly.length < 10) {
            error = "Please enter a valid phone number (minimum 10 digits) or leave blank.";
          }
        }
        break;

      case "subject":
        if (!trimmed) {
          error = "Subject is required.";
        } else if (trimmed.length < 3) {
          error = "Subject must be at least 3 characters.";
        }
        break;

      case "message":
        if (!trimmed) {
          error = "Message content is required.";
        } else if (trimmed.length < 10) {
          error = "Message must be at least 10 characters so I can assist you better.";
        }
        break;

      default:
        break;
    }
    return error;
  };

  // Validate entire form
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched = Object.keys(formData).reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = validateAll();
    if (!isValid) {
      setSubmitStatus("error");
      setFeedbackMessage("Please review and correct the highlighted fields before submitting.");
      return;
    }

    setSubmitStatus("submitting");
    setFeedbackMessage("");

    try {
      // Dispatch to FormSubmit endpoint
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "Not provided",
        _subject: `Portfolio Message from ${formData.name}: ${formData.subject}`,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        _template: "table",
        _captcha: "false"
      };

      const response = await fetch(`https://formsubmit.co/ajax/${personalInfo.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      // Check if FormSubmit requires 1-time activation
      const isActivationNeeded =
        (data.success === "false" || data.success === false) &&
        typeof data.message === "string" &&
        data.message.toLowerCase().includes("activation");

      if (isActivationNeeded) {
        setSubmitStatus("activation_needed");
        setFeedbackMessage(
          `FormSubmit requires a 1-time email confirmation! An activation email has been sent to ${personalInfo.email}. Please open your inbox (or Spam folder) and click the "Activate Form" button. In the meantime, you can forward this message instantly via WhatsApp or Email below.`
        );
        setLastSubmission({ ...formData, timestamp: new Date().toLocaleTimeString() });
        return;
      }

      if (response.ok && (data.success === "true" || data.success === true || data.success === undefined)) {
        // Trigger Confetti celebration
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {
          // Safe fallback if canvas is not supported
        }

        setSubmitStatus("success");
        setFeedbackMessage("Thank you! Your message has been sent successfully.");
        setLastSubmission({ ...formData, timestamp: new Date().toLocaleTimeString() });
        setFormData(initialFormState);
        setTouched({});
        setErrors({});
      } else {
        throw new Error(data.message || "Failed to submit enquiry.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setFeedbackMessage(
        err.message || "Failed to dispatch enquiry online. You can send this message directly via WhatsApp or Email using the options below."
      );
      setLastSubmission({ ...formData, timestamp: new Date().toLocaleTimeString() });
    }
  };

  const handleResetForm = () => {
    setSubmitStatus("idle");
    setFeedbackMessage("");
    setLastSubmission(null);
  };

  // Generate WhatsApp prefilled message
  const getWhatsAppURL = (submission) => {
    const data = submission || formData;
    const text = encodeURIComponent(
      `Hi Aiswarya, I am contacting you via your portfolio website.\n\n` +
      `*Name:* ${data.name || "Visitor"}\n` +
      `*Email:* ${data.email || "N/A"}\n` +
      `*Phone:* ${data.phone || "N/A"}\n` +
      `*Subject:* ${data.subject || "Enquiry"}\n\n` +
      `*Message:*\n${data.message || "Hello!"}`
    );
    return `https://wa.me/${personalInfo.phoneRaw}?text=${text}`;
  };

  // Generate Email prefilled mailto
  const getMailtoURL = (submission) => {
    const data = submission || formData;
    const subject = encodeURIComponent(`Portfolio Enquiry: ${data.subject || "Collaboration"}`);
    const body = encodeURIComponent(
      `Hello Aiswarya,\n\n` +
      `You received a new message from your portfolio website:\n\n` +
      `Sender Name: ${data.name}\n` +
      `Sender Email: ${data.email}\n` +
      `Sender Phone: ${data.phone}\n` +
      `Subject: ${data.subject}\n\n` +
      `Message:\n${data.message}\n\n` +
      `Best regards,\n${data.name}`
    );
    return `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="page-wrapper contact-page" id="contact-page-root">
      {/* Background Lighting */}
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-1"></div>

      {/* Page Hero */}
      <section className="page-hero-section">
        <div className="container">
          <div className="page-hero-badge">
            <Sparkles size={14} className="text-accent" />
            <span>Direct Communication &amp; Official Enquiries</span>
          </div>
          <h1 className="page-hero-title">
            Let's Start a <span className="text-gradient">Conversation</span>
          </h1>
          <p className="page-hero-lead">
            Have a project in mind, an internship opportunity, or want to collaborate on hardware and software prototyping? Reach out through the form below or connect directly.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Direct Contact Info & Socials */}
            <div className="contact-info-column">
              <div className="section-eyebrow">
                <PhoneCall size={14} /> Contact Details
              </div>
              <h2 className="contact-col-heading">
                Direct Channels &amp; <span className="text-gradient">Social Media</span>
              </h2>
              <p className="contact-col-desc">
                All links are active and route directly to my messaging channels, phone, and professional profiles.
              </p>

              {/* Direct Link Cards */}
              <div className="contact-cards-stack">
                {/* Phone Link */}
                <a 
                  href={`tel:${personalInfo.phone}`} 
                  className="contact-channel-card"
                  id="direct-phone-link"
                >
                  <div className="channel-icon-wrap bg-cyan-glow">
                    <Phone size={20} />
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">Voice Call</span>
                    <strong className="channel-value">{personalInfo.phone}</strong>
                    <span className="channel-action">Tap to call directly</span>
                  </div>
                </a>

                {/* WhatsApp Link */}
                <a 
                  href={`https://wa.me/${personalInfo.phoneRaw}?text=Hi%20Aiswarya,%20I%20am%20reaching%20out%20from%20your%20portfolio`}
                  target="_blank" 
                  rel="noreferrer"
                  className="contact-channel-card highlight-whatsapp"
                  id="direct-whatsapp-link"
                >
                  <div className="channel-icon-wrap bg-emerald-glow">
                    <MessageCircle size={20} />
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">WhatsApp (Instant Chat)</span>
                    <strong className="channel-value">{personalInfo.phone}</strong>
                    <span className="channel-action">Click to chat on WhatsApp</span>
                  </div>
                </a>

                {/* Email Link */}
                <a 
                  href={`mailto:${personalInfo.email}`} 
                  className="contact-channel-card"
                  id="direct-email-link"
                >
                  <div className="channel-icon-wrap bg-violet-glow">
                    <Mail size={20} />
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">Direct Email</span>
                    <strong className="channel-value">{personalInfo.email}</strong>
                    <span className="channel-action">Open mail client</span>
                  </div>
                </a>

                {/* Campus Address */}
                <div className="contact-channel-card static-card">
                  <div className="channel-icon-wrap bg-indigo-glow">
                    <MapPin size={20} />
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">College &amp; Location</span>
                    <strong className="channel-value">Christ College of Engineering</strong>
                    <span className="channel-sub">Autonomous • Irinjalakuda, Thrissur, Kerala</span>
                  </div>
                </div>
              </div>

              {/* Social Media Grid */}
              <div className="social-profiles-section">
                <h4 className="social-profiles-title">Social &amp; Developer Profiles</h4>
                <div className="social-profiles-grid">
                  <a
                    href={personalInfo.socials.linkedin.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-profile-pill"
                    id="contact-linkedin-link"
                  >
                    <LinkedinIcon size={18} className="text-linkedin" />
                    <span>LinkedIn</span>
                    <ExternalLink size={12} className="link-arrow" />
                  </a>

                  <a
                    href={personalInfo.socials.github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-profile-pill"
                    id="contact-github-link"
                  >
                    <GithubIcon size={18} />
                    <span>GitHub</span>
                    <ExternalLink size={12} className="link-arrow" />
                  </a>

                  <a
                    href={personalInfo.socials.instagram.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-profile-pill"
                    id="contact-instagram-link"
                  >
                    <InstagramIcon size={18} className="text-instagram" />
                    <span>Instagram</span>
                    <ExternalLink size={12} className="link-arrow" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Enquiry Form */}
            <div className="contact-form-column">
              <div className="contact-form-card" id="contact-form-container">
                <div className="form-card-header">
                  <h3 className="form-card-title">Send an Enquiry or Message</h3>
                  <p className="form-card-subtitle">
                    Fill in the form below. Real-time validation is enabled. You can also immediately forward your message to WhatsApp or Email.
                  </p>
                </div>

                {/* Error Banner if any */}
                {submitStatus === "error" && feedbackMessage && (
                  <div className="alert-banner alert-danger" role="alert">
                    <AlertCircle size={18} />
                    <span>{feedbackMessage}</span>
                  </div>
                )}
                {submitStatus === "activation_needed" && feedbackMessage && (
                  <div className="alert-banner alert-warning" role="alert">
                    <AlertCircle size={18} />
                    <span>{feedbackMessage}</span>
                  </div>
                )}

                {/* Success Card view if submitted successfully or activation needed */}
                {(submitStatus === "success" || submitStatus === "activation_needed") && lastSubmission ? (
                  <div className="submission-success-view">
                    <div
                      className="success-icon-wrap"
                      style={submitStatus === "activation_needed" ? { background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" } : undefined}
                    >
                      {submitStatus === "activation_needed" ? (
                        <AlertCircle size={48} style={{ color: "#f59e0b" }} />
                      ) : (
                        <CheckCircle2 size={48} className="text-success" />
                      )}
                    </div>
                    <h3 className="success-title">
                      {submitStatus === "activation_needed"
                        ? "Action Required: 1-Time Email Activation"
                        : "Message Registered Successfully!"}
                    </h3>
                    <p className="success-desc">
                      {submitStatus === "activation_needed" ? (
                        <>
                          FormSubmit requires a one-time activation. An email was sent to <strong>{personalInfo.email}</strong>. Please click the <strong>"Activate Form"</strong> link in your Gmail so future submissions land directly in your inbox.
                        </>
                      ) : (
                        <>
                          Thank you, <strong>{lastSubmission.name}</strong>. Your enquiry regarding "<em>{lastSubmission.subject}</em>" has been captured.
                        </>
                      )}
                    </p>

                    <div className="submission-summary-box">
                      <div className="summary-row">
                        <span className="summary-label">Sender Email:</span>
                        <span className="summary-val">{lastSubmission.email}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Phone:</span>
                        <span className="summary-val">{lastSubmission.phone}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Message:</span>
                        <span className="summary-val summary-msg-val">"{lastSubmission.message}"</span>
                      </div>
                    </div>

                    <div className="dispatch-action-box">
                      <p className="dispatch-action-title">
                        <Sparkles size={16} className="text-accent" /> Direct Forwarding Options (Message Pre-Filled):
                      </p>
                      <div className="dispatch-buttons">
                        <a
                          href={getWhatsAppURL(lastSubmission)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-whatsapp btn-block"
                        >
                          <MessageCircle size={18} />
                          <span>Forward to Aiswarya on WhatsApp (+91 6282415966)</span>
                        </a>

                        <a
                          href={getMailtoURL(lastSubmission)}
                          className="btn btn-outline btn-block"
                        >
                          <Mail size={18} />
                          <span>Open in Email App (aiswaryaajay2008@gmail.com)</span>
                        </a>
                      </div>
                    </div>

                    <div className="success-footer-actions">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="btn btn-ghost"
                      >
                        <RotateCcw size={16} /> Send Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Form */
                  <form onSubmit={handleSubmit} noValidate className="contact-form" id="portfolio-contact-form">
                    {/* Name Field */}
                    <InputField
                      id="form-name"
                      name="name"
                      label="Your Full Name"
                      placeholder="e.g. John Doe / Dr. Thomas"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name}
                      touched={touched.name}
                      required={true}
                      icon={User}
                    />

                    {/* Email & Phone Dual Column */}
                    <div className="form-row-2col">
                      <InputField
                        id="form-email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="e.g. yourname@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        required={true}
                        icon={AtSign}
                      />

                      <InputField
                        id="form-phone"
                        name="phone"
                        type="tel"
                        label="Phone / WhatsApp Number"
                        placeholder="e.g. +91 9876543210 (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        touched={touched.phone}
                        required={false}
                        icon={PhoneCall}
                        helperText="Optional"
                      />
                    </div>

                    {/* Subject Field */}
                    <InputField
                      id="form-subject"
                      name="subject"
                      label="Subject of Enquiry"
                      placeholder="e.g. Internship Offer / Hackathon Collaboration / IoT Project Query"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.subject}
                      touched={touched.subject}
                      required={true}
                      icon={FileText}
                    />

                    {/* Message Field */}
                    <InputField
                      id="form-message"
                      name="message"
                      label="Message Details"
                      rows={5}
                      placeholder="Please describe your enquiry, timeline, or project specifications in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.message}
                      touched={touched.message}
                      required={true}
                      icon={MessageSquare}
                      helperText="Minimum 10 characters"
                    />

                    {/* Form Controls */}
                    <div className="form-submit-row">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        disabled={submitStatus === "submitting"}
                        id="contact-submit-btn"
                      >
                        {submitStatus === "submitting" ? (
                          <>
                            <span className="btn-spinner"></span>
                            <span>Validating &amp; Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Submit Message</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct WhatsApp Fast Send Option */}
                    <div className="quick-wa-row">
                      <span className="quick-wa-label">Prefer instant messaging?</span>
                      <a
                        href={getWhatsAppURL(null)}
                        target="_blank"
                        rel="noreferrer"
                        className="quick-wa-link"
                      >
                        <MessageCircle size={15} />
                        <span>Chat directly with typed text on WhatsApp</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
