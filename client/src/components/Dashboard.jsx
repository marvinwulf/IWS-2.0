import Section from "./Section";
import catmascot from "../assets/cat-mascot-void.svg";
import DeviceCard from "./DeviceCard";
import DeviceMenu from "./DeviceMenu";

import SERVER_CONFIG from "../../../serverConfig";

import { useState, useEffect, useRef } from "react";

import axios from "axios";

import Icon from "@mdi/react";
import { mdiChevronDown, mdiReload } from "@mdi/js";

const ws = new WebSocket(SERVER_CONFIG.WEBSOCKET_URL);

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${JSON.stringify(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(`${name}=`));
  return cookie ? JSON.parse(cookie.split("=")[1]) : null;
};

const Dashboard = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [deviceList, setDevices] = useState([]);
  const [collapsedSections, setCollapsedSections] = useState({});

  const [isDeviceMenuOpen, setOpenDeviceMenu] = useState(false);
  const [selectedDeviceData, setSelectedDeviceData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [progress, setProgress] = useState(0);
  const [isProgressBarVisible, setProgressBarVisible] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(SERVER_CONFIG.WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "devices_update") {
        console.log("[DASHBOARD] WEBSOCKET Update:", message.data);

        // Update the device list
        setDevices(message.data);
        setLoaded(true);
      }
    };

    // ws.current.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    //   addAlert("WebSocket-Verbindung fehlgeschlagen. Server überprüfen.");
    // };

    // ws.current.onclose = () => {
    //   console.log("WebSocket connection closed.");
    //   addAlert("WebSocket-Verbindung getrennt. Seite neu laden.");
    // };

    // Cleanup WebSocket on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (selectedDeviceData) {
        const updatedDevice = deviceList.find((device) => device.UID === selectedDeviceData.UID);
        if (updatedDevice) {
          console.log("[DASHBOARD] Updated Selected Device Data:", updatedDevice);
          setSelectedDeviceData(updatedDevice); // Update the selected device data
        }
      }
    }
  }, [deviceList]);

  // Execute on website mount
  useEffect(() => {
    const savedSections = getCookie("collapsedSections");
    if (savedSections) setCollapsedSections(savedSections);
  }, []);

  //
  // Device card rendering sections
  //

  // Handle visibility of sections, save config
  const toggleSection = (key) => {
    setCollapsedSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setCookie("collapsedSections", updated);
      return updated;
    });
  };

  // Device filters determining sections
  const filters = {
    needsAttention: (device) =>
      (device.tankLevel === 0 && device.isActive === 1) || (device.batLevel && device.batLevel <= 5),
    isOnline: (device) =>
      device.tankLevel !== 0 && device.isActive === 1 && (device.batLevel > 5 || device.batLevel === null),
    isOffline: (device) => device.isActive === 0 && device.batLevel > 5,
  };

  const sectionTitles = {
    needsAttention: { singular: "Warnung", plural: "Warnungen" },
    isOnline: { singular: "Gerät online", plural: "Geräte online" },
    isOffline: { singular: "Gerät offline", plural: "Geräte offline" },
  };

  const getDeviceCountText = (key, count) => {
    const title = sectionTitles[key] || { singular: "Gerät", plural: "Geräte" };
    return count === 1 ? title.singular : title.plural;
  };

  // Render category section if devices fit into the different categories and section is visible
  const renderSection = (filterFn, key, isLast) => {
    const filteredDevices = deviceList.filter(filterFn);
    if (!filteredDevices.length) return null;

    const isCollapsed = collapsedSections[key];
    const deviceCountText = getDeviceCountText(key, filteredDevices.length);

    return (
      <div className={!isLast && !isCollapsed ? "mb-5" : ""}>
        <div className="relative top-[26px] flex items-center mr-12 ml-6">
          <Icon
            size={1}
            rotate={isCollapsed ? 180 : 0}
            path={mdiChevronDown}
            className="absolute left-2 -top-0.5 text-n-9 cursor-pointer hover-never:bg-n-6 rounded-md z-2"
            onClick={() => toggleSection(key)}
          />
          <span className="relative text-n-9 font-300 bg-[#0e0c15] text-sm pl-9 pr-2 select-none z-1">
            {filteredDevices.length} {deviceCountText}
          </span>
          <div className="absolute bg-n-6 h-0.25 w-full" />
        </div>

        <div className="pt-10 mt-4 mx-4">
          {!isCollapsed && (
            <div className="gridcontainer select-none">
              {filteredDevices.map((device) => (
                <DeviceCard key={device.UID} device={device} onClick={() => openDeviceMenuHandler(device.UID)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  //
  // Dashboard rendering
  //

  // Handling of the device menu, loading the clicked card data into selectedDeviceData
  const openDeviceMenuHandler = (UID) => {
    console.log("Opening device menu");
    setOpenDeviceMenu(true);

    const device = deviceList.find((device) => device.UID === UID);

    if (device) {
      setSelectedDeviceData(device);
      console.log("Selected Device Data:", device);
    }
  };

  // Close the device menu and make an API request in the background
  const closeDeviceMenuHandler = () => {
    console.log("Closing device menu");
    setSelectedDeviceData(null);
    setOpenDeviceMenu(false);
  };

  // Optimistically update the deviceList with the edited data
  const updateDeviceList = (updatedDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => (device.UID === updatedDevice.UID ? { ...updatedDevice } : device))
    );
    console.log("[DASHBOARD] Optimistic Device Update:", updatedDevice);
  };

  const addAlert = (message) => {
    setAlerts((prevAlerts) => {
      const existingAlert = prevAlerts.find((alert) => alert.message === message);

      if (existingAlert) {
        return prevAlerts.map((alert) =>
          alert.message === message ? { ...alert, count: alert.count + 1, isVisible: true } : alert
        );
      } else {
        const newAlert = { message, id: Date.now(), count: 1, isVisible: true };
        setTimeout(() => closeAlert(newAlert.id), 5000);
        return [...prevAlerts, newAlert];
      }
    });
  };

  const closeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.map((alert) => (alert.id === id ? { ...alert, isVisible: false } : alert)));

    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 300);
  };

  // Dashboard page showing the sections and corresponding device cards
  return (
    <Section crossesOffset="lg:translate-y-[5rem]" customPaddings id="dashboard">
      <div className="md:mx-6 lg:mx-8 xl:mx-10 pt-20 pb-10 min-h-svh">
        {isLoaded ? (
          <div>
            {renderSection(
              filters.needsAttention,
              "needsAttention",
              !deviceList.some(filters.isOnline) && !deviceList.some(filters.isOffline)
            )}
            {renderSection(filters.isOnline, "isOnline", !deviceList.some(filters.isOffline))}
            {renderSection(filters.isOffline, "isOffline", true)}

            {!deviceList.length && (
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-svh">
                <div className="flex flex-col items-center">
                  <img src={catmascot} alt="No Content Cat Mascot" className="relative -mb-8 -mt-12 z-10" width={200} />
                  <p className="body-2 text-center max-w-sm z-10">Noch keine IWS Geräte</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-svh">
            <div className="flex flex-col gap-4 items-center overflow-hidden">
              <div className="absolute h-10 w-10 border-4 border-n-6 rounded-full"></div>
              <div className="h-10 w-10 border-4 border-t-transparent border-n-2 rounded-full animate-spin"></div>
              <p className="body-2 z-10 text-n-2">Daten aktualisieren</p>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {alerts.map((alert) => {
          const layerCount = Math.min(alert.count, 3);

          return (
            <div
              key={alert.id}
              className={`relative transition-all duration-300 ease-in-out
          ${alert.isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}
              style={{
                animation: alert.isVisible ? "fadeIn 0.3s ease-out forwards" : "fadeOut 0.3s ease-in forwards",
              }}
            >
              {/* Stacked Layers (up to 2 extra) */}
              {[...Array(layerCount)].map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full h-full bg-n-7 border border-n-6 rounded-lg shadow-md"
                  style={{
                    top: `-${index * 8}px`,
                    left: `-${index * 8}px`,
                    zIndex: -index,
                  }}
                />
              ))}

              {/* Main Alert (on top) */}
              <div className="relative flex items-center px-4 py-3 min-w-[320px] w-[27vw] h-14 bg-n-11 border border-n-6 rounded-lg shadow-xl">
                <span className="text-sm pr-6">{alert.message}</span>

                {alert.count > 1 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-700 text-white text-xs font-bold rounded-full shadow-md">
                    <p className="relative -left-[0.5px]">{alert.count}</p>
                  </span>
                )}

                <button
                  className="absolute top-[15px] right-4 text-n-4 hover-never:text-white"
                  onClick={() => closeAlert(alert.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isDeviceMenuOpen && selectedDeviceData && (
        <div>
          <DeviceMenu
            selectedDeviceDataProp={selectedDeviceData}
            isVisible={isDeviceMenuOpen}
            onClose={() => {
              closeDeviceMenuHandler();
            }}
            onUpdateDevice={updateDeviceList}
            onError={() => addAlert("Daten-Update fehlgeschlagen. API Server überprüfen.")}
          />
        </div>
      )}
    </Section>
  );
};

export default Dashboard;
