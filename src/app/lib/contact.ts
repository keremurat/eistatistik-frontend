const gmailComposeUrl = (subject: string, body: string) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: "info@eistatistik.com",
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
};

export const getGmailContactUrl = (service?: string) => gmailComposeUrl(
  service ? `eistatistik ${service} Bilgi Talebi` : "eistatistik Bilgi ve Destek Talebi",
  [
    "Merhaba eistatistik ekibi,",
    "",
    service ? `${service} hizmeti hakkında bilgi almak istiyorum.` : "Hizmetleriniz hakkında bilgi almak istiyorum.",
    "",
    "Talebim / sorum:",
    "",
    "",
    "Ad Soyad:",
    "Telefon:",
    `İlgilendiğim hizmet: ${service ?? ""}`,
    "",
    "İyi çalışmalar.",
  ].join("\n"),
);

export const GMAIL_CONTACT_URL = getGmailContactUrl();

export const GMAIL_PASSWORD_URL = gmailComposeUrl(
  "eistatistik Şifre Yenileme Talebi",
  [
    "Merhaba eistatistik ekibi,",
    "",
    "Hesabıma erişemediğim için şifre yenileme desteği rica ediyorum.",
    "",
    "Ad Soyad:",
    "Kayıtlı e-posta adresi:",
    "Telefon:",
    "",
    "İyi çalışmalar.",
  ].join("\n"),
);
