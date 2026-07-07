"use client";

import { useCallback, useEffect, useState } from "react";
import { Wifi, RefreshCw, Cpu } from "lucide-react";
import { DeviceAPI } from "@/lib/be";
import { useI18n, type TKey } from "@/lib/i18n";
import type { DeviceInfo } from "@/lib/types";
import { Button, Card, Badge, Modal, Input, Alert, Spinner } from "@/components/ui";

function signalBars(dbm: number) {
  if (dbm >= -50) return 4;
  if (dbm >= -60) return 3;
  if (dbm >= -70) return 2;
  return 1;
}

const COMPONENT_KEYS: Record<string, TKey> = {
  microphone: "microphone",
  speaker: "speaker",
  temp_sensor: "temp_sensor",
  camera: "camera",
  led: "led",
};

export default function DevicePage() {
  const { t } = useI18n();
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState(false);

  const load = useCallback(() => {
    DeviceAPI.info().then(setDevice).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const changeWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await DeviceAPI.setWifi(ssid, password);
      setWifiOpen(false);
      setUpdated(true);
      setSsid("");
      setPassword("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  if (!device) return <Spinner />;

  const bars = signalBars(device.wifi.signalStrength);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t("deviceTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("deviceDesc")}</p>
        </div>
        <Button variant="secondary" onClick={load}>
          <RefreshCw size={16} /> {t("refresh")}
        </Button>
      </div>

      {updated && (
        <div className="mb-4">
          <Alert kind="success">{t("wifiUpdated")}</Alert>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2 font-medium text-slate-900">
            <Cpu size={18} className="text-sen" /> {t("model")}
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("model")}</dt>
              <dd className="font-medium text-slate-800">{device.model}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("firmware")}</dt>
              <dd className="font-medium text-slate-800">
                v{device.firmwareVersion}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Wifi size={18} className="text-sen" /> {t("wifiNetwork")}
            </div>
            <Button variant="secondary" onClick={() => setWifiOpen(true)}>
              {t("changeWifi")}
            </Button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">SSID</dt>
              <dd className="font-medium text-slate-800">{device.wifi.ssid}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("signal")}</dt>
              <dd className="flex items-center gap-2 font-medium text-slate-800">
                <span className="flex items-end gap-0.5">
                  {[1, 2, 3, 4].map((b) => (
                    <span
                      key={b}
                      className={
                        "w-1 rounded-sm " +
                        (b <= bars ? "bg-leaf" : "bg-slate-200")
                      }
                      style={{ height: 4 + b * 3 }}
                    />
                  ))}
                </span>
                {device.wifi.signalStrength} dBm
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("ipAddress")}</dt>
              <dd className="font-medium text-slate-800">{device.wifi.ip}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <h3 className="mb-3 mt-6 font-medium text-slate-900">
        {t("componentHealth")}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {device.components.map((c) => (
          <Card key={c.name} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-slate-800">
              {COMPONENT_KEYS[c.name] ? t(COMPONENT_KEYS[c.name]) : c.name}
            </span>
            {c.status === "online" ? (
              <Badge color="green">{t("online")}</Badge>
            ) : c.status === "offline" ? (
              <Badge color="gray">{t("offline")}</Badge>
            ) : (
              <Badge color="red">{t("compError")}</Badge>
            )}
          </Card>
        ))}
      </div>

      <Modal
        open={wifiOpen}
        onClose={() => setWifiOpen(false)}
        title={t("changeWifi")}
      >
        <form onSubmit={changeWifi} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Input
            label={t("wifiName")}
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            required
          />
          <Input
            label={t("wifiPassword")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setWifiOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? t("loading") : t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
