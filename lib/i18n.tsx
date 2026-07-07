"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "vi" | "en";

const dict = {
  vi: {
    appName: "SEN",
    tagline: "Người bạn đồng hành AI cho người lớn tuổi",
    // auth
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
    // tabs
    contacts: "Liên hệ",
    voiceTraining: "Huấn luyện giọng nói",
    logs: "Nhật ký",
    deviceConfig: "Cấu hình thiết bị",
    // contacts
    contactsTitle: "Tích hợp kênh liên lạc",
    contactsDesc: "Kết nối các kênh nhắn tin với trợ lý của bạn.",
    connect: "Kết nối",
    disconnect: "Ngắt kết nối",
    connected: "Đã kết nối",
    notConnected: "Chưa kết nối",
    channelError: "Lỗi",
    credentials: "Thông tin xác thực",
    cancel: "Hủy",
    save: "Lưu",
    // voice training
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
    // logs
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
    // device
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
    refresh: "Làm mới",
    // misc
    loading: "Đang tải…",
    language: "Ngôn ngữ",
    developer: "developer",
    user: "user",
    microphone: "Micro",
    speaker: "Loa",
    temp_sensor: "Cảm biến nhiệt độ",
    camera: "Camera",
    led: "Đèn LED",
  },
  en: {
    appName: "SEN",
    tagline: "Your AI companion for seniors",
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
    contacts: "Contacts",
    voiceTraining: "Voice Training",
    logs: "Logs",
    deviceConfig: "Device Config",
    contactsTitle: "Contact Integrations",
    contactsDesc: "Connect messaging channels to your assistant.",
    connect: "Connect",
    disconnect: "Disconnect",
    connected: "Connected",
    notConnected: "Not connected",
    channelError: "Error",
    credentials: "Credentials",
    cancel: "Cancel",
    save: "Save",
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
    refresh: "Refresh",
    loading: "Loading…",
    language: "Language",
    developer: "developer",
    user: "user",
    microphone: "Microphone",
    speaker: "Speaker",
    temp_sensor: "Temperature sensor",
    camera: "Camera",
    led: "LED",
  },
} as const;

export type TKey = keyof (typeof dict)["vi"];

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

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "vi") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: TKey) => dict[lang][key] ?? dict.vi[key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
