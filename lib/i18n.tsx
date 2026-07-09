"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiError } from "./api";

export type Lang = "vi" | "en";

const dict = {
  vi: {
    // --- section: common ---
    logoAlt: "Logo SEN",
    dismissNotification: "Đóng thông báo",
    appName: "SEN",
    tagline: "Người bạn đồng hành AI cho người lớn tuổi",
    errNetwork: "Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.",
    errTimeout: "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.",
    errServer: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
    errUnknown: "Đã xảy ra lỗi. Vui lòng thử lại.",
    errUnauthorized: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    retry: "Thử lại",
    cancel: "Hủy",
    confirm: "Xác nhận",
    close: "Đóng",
    copy: "Sao chép",
    copied: "Đã sao chép",
    refresh: "Làm mới",
    loading: "Đang tải…",
    empty: "Chưa có dữ liệu",
    success: "Thành công",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
    save: "Lưu",
    language: "Ngôn ngữ",
    // --- section: auth ---
    emailInvalid: "Vui lòng nhập địa chỉ email hợp lệ.",
    errSignInInvalid: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
    forgotPasswordDesc: "Nhập email của bạn để nhận liên kết đặt lại mật khẩu.",
    newPassword: "Mật khẩu mới",
    resetPasswordDesc: "Nhập mật khẩu mới cho tài khoản của bạn.",
    resetSuccess: "Đã đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.",
    resetLinkInvalid:
      "Liên kết đặt lại không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.",
    requestNewLink: "Yêu cầu liên kết mới",
    forgotHintMock: "Mẹo (mock): không có email thật được gửi —",
    openResetLink: "mở liên kết đặt lại tại đây",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    signOut: "Đăng xuất",
    email: "Email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    resetPassword: "Đặt lại mật khẩu",
    sendResetLink: "Gửi liên kết đặt lại",
    resetLinkSent: "Nếu email tồn tại, liên kết đặt lại đã được gửi.",
    noAccount: "Chưa có tài khoản?",
    haveAccount: "Đã có tài khoản?",
    backToSignIn: "Quay lại đăng nhập",
    passwordMismatch: "Mật khẩu không khớp",
    passwordTooShort: "Mật khẩu phải có ít nhất 6 ký tự",
    signInHint: "Mẹo (mock): email chứa \"dev\" sẽ có vai trò developer.",
    // --- section: layout ---
    navSections: "Các mục bảng điều khiển",
    contacts: "Liên hệ",
    voiceTraining: "Huấn luyện giọng nói",
    logs: "Nhật ký",
    deviceConfig: "Cấu hình thiết bị",
    roleDeveloper: "Nhà phát triển",
    roleUser: "Người dùng",
    // --- section: landing ---
    landingHeroTitle: "Ông bà luôn có người trò chuyện, con cháu luôn an tâm",
    landingHeroSubtitle:
      "SEN là thiết bị AI nhỏ gọn đặt trong nhà: trò chuyện bằng tiếng Việt, đọc tin nhắn của con cháu và nhắc nhở nhẹ nhàng mỗi ngày. Cả nhà quản lý mọi thứ từ xa, chỉ với vài chạm.",
    landingOpenDashboard: "Mở bảng điều khiển",
    landingFeaturesTitle: "SEN làm được gì?",
    landingFeaturesSubtitle:
      "Bốn tính năng chính, thiết kế để người lớn tuổi dùng thật dễ dàng.",
    landingFeatureChannelsTitle: "Kết nối Zalo, Messenger, Telegram",
    landingFeatureChannelsDesc:
      "Tin nhắn của con cháu đến thẳng SEN — ông bà chỉ cần nghe và trả lời bằng giọng nói.",
    landingFeatureVoiceTitle: "Nghe quen giọng của ông bà",
    landingFeatureVoiceDesc:
      "Chỉ vài phút đọc câu mẫu là SEN hiểu rõ giọng nói, kể cả giọng vùng miền.",
    landingFeatureDeviceTitle: "Theo dõi thiết bị từ xa",
    landingFeatureDeviceDesc:
      "Xem tình trạng máy SEN (ESP32), Wi-Fi, loa và micro ngay trên điện thoại, dù bạn ở đâu.",
    landingFeatureSafetyTitle: "An toàn và riêng tư",
    landingFeatureSafetyDesc:
      "Dữ liệu giọng nói được bảo vệ cẩn thận; chỉ người thân trong gia đình mới truy cập được.",
    landingHowTitle: "Bắt đầu trong 3 bước",
    landingStep1Title: "Cắm điện, kết nối Wi-Fi",
    landingStep1Desc:
      "Đặt SEN ở nơi ông bà hay ngồi và kết nối mạng nhà trong vài phút.",
    landingStep2Title: "Liên kết kênh nhắn tin",
    landingStep2Desc:
      "Con cháu kết nối Zalo, Messenger hoặc Telegram của gia đình ngay trên trang này.",
    landingStep3Title: "Trò chuyện mỗi ngày",
    landingStep3Desc:
      "Ông bà trò chuyện với SEN thật tự nhiên — cả nhà luôn gần nhau.",
    // --- section: contacts ---
    credOaId: "Mã Official Account Zalo (OA ID)",
    credAccessToken: "Mã truy cập (Access Token)",
    credPageId: "Mã trang Facebook (Page ID)",
    credPageAccessToken: "Mã truy cập trang (Page Access Token)",
    credBotToken: "Mã bot Telegram (Bot Token)",
    credRequired: "Vui lòng nhập thông tin này",
    showSecret: "Hiện giá trị",
    hideSecret: "Ẩn giá trị",
    noChannels: "Chưa có kênh liên lạc nào",
    noChannelsDesc: "Khi có kênh mới, kênh sẽ hiện ở đây.",
    connectedToast: "Đã kết nối {channel} thành công!",
    disconnectedToast: "Đã ngắt kết nối {channel}.",
    disconnectConfirmTitle: "Ngắt kết nối {channel}?",
    disconnectConfirmBody:
      "Sau khi ngắt kết nối, bạn sẽ phải nhập lại thông tin xác thực để kết nối lại kênh này.",
    channelErrInvalidCredentials:
      "Thông tin xác thực không còn hợp lệ. Vui lòng kết nối lại.",
    channelErrGeneric: "Kênh đang gặp lỗi. Vui lòng kết nối lại.",
    errMissingCredentials: "Vui lòng điền đầy đủ thông tin xác thực.",
    errInvalidCredentials:
      "Thông tin xác thực không được chấp nhận. Vui lòng kiểm tra và thử lại.",
    errChannelNotFound: "Không tìm thấy kênh này. Vui lòng tải lại trang.",
    contactsTitle: "Tích hợp kênh liên lạc",
    contactsDesc: "Kết nối các kênh nhắn tin với trợ lý của bạn.",
    connect: "Kết nối",
    disconnect: "Ngắt kết nối",
    connected: "Đã kết nối",
    notConnected: "Chưa kết nối",
    channelError: "Lỗi",
    credentials: "Thông tin xác thực",
    // --- section: voice ---
    micRequesting: "Đang xin quyền dùng micro…",
    micUnsupported:
      "Trình duyệt này không hỗ trợ ghi âm. Vui lòng dùng trình duyệt mới hơn như Chrome, Edge hoặc Safari.",
    micInsecure:
      "Ghi âm cần kết nối an toàn (HTTPS). Vui lòng mở trang này qua địa chỉ bắt đầu bằng https://.",
    micNotFound:
      "Không tìm thấy micro. Vui lòng kiểm tra micro đã được cắm hoặc bật, rồi thử lại.",
    micStartError: "Không thể bắt đầu ghi âm. Vui lòng thử lại.",
    micDeniedHelp:
      "Hãy nhấn vào biểu tượng ổ khóa hoặc micro cạnh thanh địa chỉ, chọn “Cho phép” micro, rồi bấm Ghi âm lại.",
    recordingStopped: "Đã dừng ghi âm.",
    recordingTooShort:
      "Đoạn ghi âm quá ngắn (dưới 1 giây). Vui lòng bấm Ghi âm và đọc lại câu.",
    recordingMaxReached:
      "Đã đạt tối đa 60 giây nên ghi âm tự dừng. Bạn có thể nghe lại và gửi.",
    noPrompts: "Chưa có câu mẫu nào. Vui lòng quay lại sau.",
    historyRefreshFailed: "Chưa cập nhật được lịch sử. Hệ thống sẽ tự thử lại.",
    submitRetryHint: "Bản ghi của bạn vẫn còn — hãy bấm Gửi để thử lại.",
    reasonAudioUnclear: "Âm thanh chưa rõ. Hãy ghi âm lại ở nơi yên tĩnh hơn.",
    reasonUnknown: "Xử lý không thành công. Hãy ghi âm lại câu này.",
    reRecordPrompt: "Ghi âm lại câu này",
    playback: "Nghe lại bản ghi",
    voiceTitle: "Huấn luyện giọng nói",
    voiceDesc: "Đọc to câu mẫu bên dưới và ghi âm giọng của bạn.",
    readAloud: "Hãy đọc to câu sau:",
    record: "Ghi âm",
    stop: "Dừng",
    recording: "Đang ghi âm…",
    reRecord: "Ghi lại",
    submit: "Gửi",
    submitting: "Đang gửi…",
    nextPrompt: "Câu khác",
    micDenied: "Không truy cập được micro. Vui lòng cấp quyền micro cho trình duyệt.",
    sampleHistory: "Lịch sử mẫu đã gửi",
    noSamples: "Chưa có mẫu nào.",
    statusPending: "Đang chờ",
    statusProcessed: "Đã xử lý",
    statusFailed: "Thất bại",
    submitted: "Đã gửi mẫu ghi âm!",
    microphone: "Micro",
    // --- section: logs ---
    logsLast15m: "15 phút qua",
    logsLast1h: "1 giờ qua",
    logsLast24h: "24 giờ qua",
    logsLast7d: "7 ngày qua",
    logsEventSingular: "sự kiện",
    logsEventPlural: "sự kiện",
    logsCapHint:
      "Chỉ hiển thị 50 sự kiện mới nhất — hãy thu hẹp bộ lọc để xem các sự kiện cũ hơn.",
    logsCopyFailed: "Không thể sao chép. Vui lòng thử lại.",
    logsAutoRefreshOn: "Tự động làm mới mỗi 15 giây.",
    logsTitle: "Nhật ký API",
    logsDesc: "Các sự kiện request/response giữa thiết bị và backend.",
    direction: "Chiều",
    all: "Tất cả",
    incoming: "Vào",
    outgoing: "Ra",
    status: "Trạng thái",
    time: "Thời gian",
    endpoint: "Endpoint",
    payload: "Payload",
    response: "Response",
    noLogs: "Không có nhật ký phù hợp.",
    // --- section: device ---
    updatedJustNow: "Vừa cập nhật xong",
    updatedSecondsAgo: "Đã cập nhật {seconds} giây trước",
    updatedAtTime: "Cập nhật lúc {time}",
    refreshFailed: "Không thể làm mới — đang hiển thị dữ liệu đã lưu trước đó.",
    signalStrong: "Mạnh",
    signalFair: "Trung bình",
    signalWeak: "Yếu",
    wifiPasswordHint: "Để trống nếu mạng Wi-Fi không có mật khẩu.",
    wifiPasswordTooShort: "Mật khẩu Wi-Fi phải có ít nhất 8 ký tự.",
    wifiSsidRequired: "Vui lòng nhập tên mạng (SSID).",
    deviceTitle: "Cấu hình thiết bị (ESP32)",
    deviceDesc: "Thông tin thiết bị, Wi-Fi và tình trạng linh kiện.",
    model: "Model",
    firmware: "Firmware",
    wifiNetwork: "Mạng Wi-Fi",
    signal: "Tín hiệu",
    ipAddress: "Địa chỉ IP",
    changeWifi: "Đổi Wi-Fi",
    wifiName: "Tên mạng (SSID)",
    wifiPassword: "Mật khẩu Wi-Fi",
    wifiUpdated: "Đã kết nối Wi-Fi mới!",
    componentHealth: "Tình trạng linh kiện",
    online: "Hoạt động",
    offline: "Ngoại tuyến",
    compError: "Lỗi",
    speaker: "Loa",
    temp_sensor: "Cảm biến nhiệt độ",
    camera: "Camera",
    led: "Đèn LED",
  },
  en: {
    // --- section: common ---
    logoAlt: "SEN logo",
    dismissNotification: "Dismiss notification",
    appName: "SEN",
    tagline: "Your AI companion for seniors",
    errNetwork: "Cannot connect. Please check your internet and try again.",
    errTimeout: "The request took too long. Please try again.",
    errServer: "The server had a problem. Please try again later.",
    errUnknown: "Something went wrong. Please try again.",
    errUnauthorized: "Your session has expired. Please sign in again.",
    retry: "Try again",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    refresh: "Refresh",
    loading: "Loading…",
    empty: "No data yet",
    success: "Success",
    showPassword: "Show password",
    hidePassword: "Hide password",
    save: "Save",
    language: "Language",
    // --- section: auth ---
    emailInvalid: "Please enter a valid email address.",
    errSignInInvalid: "Incorrect email or password. Please try again.",
    forgotPasswordDesc: "Enter your email to receive a password reset link.",
    newPassword: "New password",
    resetPasswordDesc: "Enter a new password for your account.",
    resetSuccess: "Password reset! You can now sign in with your new password.",
    resetLinkInvalid:
      "This reset link is invalid or has expired. Please request a new one.",
    requestNewLink: "Request a new link",
    forgotHintMock: "Tip (mock): no real email is sent —",
    openResetLink: "open the reset link here",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset password",
    sendResetLink: "Send reset link",
    resetLinkSent: "If the email exists, a reset link has been sent.",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    backToSignIn: "Back to sign in",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    signInHint: "Tip (mock): emails containing \"dev\" get the developer role.",
    // --- section: layout ---
    navSections: "Dashboard sections",
    contacts: "Contacts",
    voiceTraining: "Voice Training",
    logs: "Logs",
    deviceConfig: "Device Config",
    roleDeveloper: "Developer",
    roleUser: "User",
    // --- section: landing ---
    landingHeroTitle: "Someone to talk to every day, peace of mind for the family",
    landingHeroSubtitle:
      "SEN is a small AI device that lives at home: it chats in Vietnamese, reads out family messages and gives gentle daily reminders. The family manages everything remotely, in just a few taps.",
    landingOpenDashboard: "Open dashboard",
    landingFeaturesTitle: "What can SEN do?",
    landingFeaturesSubtitle:
      "Four core features, designed to be truly easy for seniors.",
    landingFeatureChannelsTitle: "Connects Zalo, Messenger, Telegram",
    landingFeatureChannelsDesc:
      "Family messages go straight to SEN — your loved one just listens and replies by voice.",
    landingFeatureVoiceTitle: "Learns your loved one's voice",
    landingFeatureVoiceDesc:
      "A few minutes of reading sample sentences and SEN understands them clearly — regional accents included.",
    landingFeatureDeviceTitle: "Monitor the device remotely",
    landingFeatureDeviceDesc:
      "Check the SEN device (ESP32), its Wi-Fi, speaker and microphone from your phone, wherever you are.",
    landingFeatureSafetyTitle: "Safe and private",
    landingFeatureSafetyDesc:
      "Voice data is carefully protected; only the family members you invite have access.",
    landingHowTitle: "Get started in 3 steps",
    landingStep1Title: "Plug in, connect Wi-Fi",
    landingStep1Desc:
      "Place SEN where your loved one likes to sit and join the home network in minutes.",
    landingStep2Title: "Link messaging channels",
    landingStep2Desc:
      "Family members connect Zalo, Messenger or Telegram right on this hub.",
    landingStep3Title: "Chat every day",
    landingStep3Desc:
      "Your loved one talks to SEN naturally — the family always feels close.",
    // --- section: contacts ---
    credOaId: "Zalo Official Account ID (OA ID)",
    credAccessToken: "Access token",
    credPageId: "Facebook Page ID",
    credPageAccessToken: "Page access token",
    credBotToken: "Telegram bot token",
    credRequired: "Please fill in this field",
    showSecret: "Show value",
    hideSecret: "Hide value",
    noChannels: "No channels yet",
    noChannelsDesc: "New channels will appear here when available.",
    connectedToast: "Connected to {channel}!",
    disconnectedToast: "Disconnected {channel}.",
    disconnectConfirmTitle: "Disconnect {channel}?",
    disconnectConfirmBody:
      "After disconnecting, you will need to re-enter the credentials to connect this channel again.",
    channelErrInvalidCredentials:
      "The saved credentials are no longer valid. Please connect again.",
    channelErrGeneric: "This channel has a problem. Please connect again.",
    errMissingCredentials: "Please fill in all credential fields.",
    errInvalidCredentials:
      "The credentials were not accepted. Please check them and try again.",
    errChannelNotFound: "This channel was not found. Please reload the page.",
    contactsTitle: "Contact Integrations",
    contactsDesc: "Connect messaging channels to your assistant.",
    connect: "Connect",
    disconnect: "Disconnect",
    connected: "Connected",
    notConnected: "Not connected",
    channelError: "Error",
    credentials: "Credentials",
    // --- section: voice ---
    micRequesting: "Requesting microphone access…",
    micUnsupported:
      "This browser does not support audio recording. Please use a newer browser such as Chrome, Edge or Safari.",
    micInsecure:
      "Recording needs a secure (HTTPS) connection. Please open this page at an address starting with https://.",
    micNotFound:
      "No microphone was found. Please check that a microphone is plugged in or turned on, then try again.",
    micStartError: "Could not start recording. Please try again.",
    micDeniedHelp:
      "Click the lock or microphone icon next to the address bar, choose “Allow” for the microphone, then press Record again.",
    recordingStopped: "Recording stopped.",
    recordingTooShort:
      "The recording was too short (under 1 second). Please press Record and read the sentence again.",
    recordingMaxReached:
      "The 60-second limit was reached, so recording stopped automatically. You can listen and submit.",
    noPrompts: "No sample sentences yet. Please check back later.",
    historyRefreshFailed: "Could not refresh the history. It will retry automatically.",
    submitRetryHint: "Your recording is still here — press Submit to try again.",
    reasonAudioUnclear: "The audio was not clear. Please record again in a quieter place.",
    reasonUnknown: "Processing did not succeed. Please record this sentence again.",
    reRecordPrompt: "Re-record this sentence",
    playback: "Listen to your recording",
    voiceTitle: "Voice Training",
    voiceDesc: "Read the sample sentence below aloud and record your voice.",
    readAloud: "Please read this sentence aloud:",
    record: "Record",
    stop: "Stop",
    recording: "Recording…",
    reRecord: "Re-record",
    submit: "Submit",
    submitting: "Submitting…",
    nextPrompt: "Another sentence",
    micDenied: "Microphone unavailable. Please grant mic permission in your browser.",
    sampleHistory: "Submitted samples",
    noSamples: "No samples yet.",
    statusPending: "Pending",
    statusProcessed: "Processed",
    statusFailed: "Failed",
    submitted: "Sample submitted!",
    microphone: "Microphone",
    // --- section: logs ---
    logsLast15m: "Last 15 minutes",
    logsLast1h: "Last hour",
    logsLast24h: "Last 24 hours",
    logsLast7d: "Last 7 days",
    logsEventSingular: "event",
    logsEventPlural: "events",
    logsCapHint:
      "Showing only the 50 most recent events — narrow the filters to see older ones.",
    logsCopyFailed: "Could not copy. Please try again.",
    logsAutoRefreshOn: "Auto-refreshes every 15 seconds.",
    logsTitle: "API Logs",
    logsDesc: "Request/response events between device and backend.",
    direction: "Direction",
    all: "All",
    incoming: "In",
    outgoing: "Out",
    status: "Status",
    time: "Time",
    endpoint: "Endpoint",
    payload: "Payload",
    response: "Response",
    noLogs: "No matching logs.",
    // --- section: device ---
    updatedJustNow: "Updated just now",
    updatedSecondsAgo: "Updated {seconds} seconds ago",
    updatedAtTime: "Updated at {time}",
    refreshFailed: "Could not refresh — showing the last saved data.",
    signalStrong: "Strong",
    signalFair: "Fair",
    signalWeak: "Weak",
    wifiPasswordHint: "Leave empty if the Wi-Fi network has no password.",
    wifiPasswordTooShort: "Wi-Fi password must be at least 8 characters.",
    wifiSsidRequired: "Please enter the network name (SSID).",
    deviceTitle: "Device Configuration (ESP32)",
    deviceDesc: "Device info, Wi-Fi and component health.",
    model: "Model",
    firmware: "Firmware",
    wifiNetwork: "Wi-Fi network",
    signal: "Signal",
    ipAddress: "IP address",
    changeWifi: "Change Wi-Fi",
    wifiName: "Network name (SSID)",
    wifiPassword: "Wi-Fi password",
    wifiUpdated: "Connected to new Wi-Fi!",
    componentHealth: "Component health",
    online: "Online",
    offline: "Offline",
    compError: "Error",
    speaker: "Speaker",
    temp_sensor: "Temperature sensor",
    camera: "Camera",
    led: "LED",
  },
} as const;

export type TKey = keyof (typeof dict)["vi"];

/**
 * Map an unknown thrown value to a localized, human-friendly message.
 * NEVER render raw err.message (English server/browser strings) — use this
 * everywhere an API error is shown to the user.
 */
export function tApiError(err: unknown, t: (key: TKey) => string): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "network":
        return t("errNetwork");
      case "timeout":
        return t("errTimeout");
      case "unauthorized":
        return t("errUnauthorized");
      case "server":
        return t("errServer");
      default:
        return t("errUnknown");
    }
  }
  return t("errUnknown");
}

const dtFormatters: Partial<Record<Lang, Intl.DateTimeFormat>> = {};

/**
 * Format a timestamp following the app language (not the browser locale).
 * Use this for every rendered date/time.
 */
export function formatDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const fmt = (dtFormatters[lang] ??= new Intl.DateTimeFormat(
    lang === "vi" ? "vi-VN" : "en-US",
    { dateStyle: "short", timeStyle: "short" }
  ));
  return fmt.format(d);
}

function readStoredLang(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("lang");
    return saved === "en" || saved === "vi" ? saved : null;
  } catch {
    return null;
  }
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "vi",
  setLang: () => {},
  t: (k) => dict.vi[k],
});

function persistLang(l: Lang) {
  try {
    localStorage.setItem("lang", l);
  } catch {
    // storage unavailable (private mode) — keep in-memory language only
  }
  try {
    // Cookie lets the server render the right language on the next load,
    // so there is no hydration mismatch and no vi/en flash.
    document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`;
  } catch {
    // cookies unavailable — server keeps the default language
  }
}

export function I18nProvider({
  children,
  initialLang = "vi",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  // Start from the language the server rendered (read from the "lang"
  // cookie in app/layout.tsx) so the first client render matches the
  // server HTML exactly — no hydration mismatch, no vi/en flash.
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Keep the document language in sync (screen-reader pronunciation,
  // translation prompts, hyphenation) — on init and on every switch.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    persistLang(l);
  };

  // One-time migration for users whose preference predates the cookie and
  // only lives in localStorage: switch after mount (a single visible flip)
  // and persist the cookie so every later load is server-rendered correctly.
  useEffect(() => {
    const stored = readStoredLang();
    if (stored && stored !== initialLang) {
      setLangState(stored);
    }
    if (stored) {
      persistLang(stored);
    }
    // Run once on mount only — later changes go through setLang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = (key: TKey) => dict[lang][key] ?? dict.vi[key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
