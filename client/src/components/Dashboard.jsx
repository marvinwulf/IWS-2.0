import Section from "./Section";
import PlusSvg from "../assets/svg/PlusSvg";
import catmascot from "../assets/cat-mascot-void.svg";
import DeviceCard from "./DeviceCard";
import { useState, useEffect } from "react";
import axios from "axios";

import Icon from "@mdi/react";
import { mdiChevronDown, mdiReload } from "@mdi/js";

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

  const fetchDevices = async () => {
    setLoaded(false);
    try {
      const { data } = await axios.get("http://localhost:8080/devices");
      setDevices(data.devices || []);

      setLoaded(true);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices();

    const savedSections = getCookie("collapsedSections");
    if (savedSections) setCollapsedSections(savedSections);
  }, []);

  // DeviceCard Rendering Section
  const toggleSection = (key) => {
    setCollapsedSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setCookie("collapsedSections", updated);
      return updated;
    });
  };

  const renderSection = (filterFn, key, isLast) => {
    const filteredDevices = deviceList.filter(filterFn);
    if (!filteredDevices.length) return null;

    const isCollapsed = collapsedSections[key];

    const deviceCountText = filteredDevices.length === 1 ? "Gerät" : "Geräte";

    let title;
    switch (key) {
      case "needsAttention":
        if (filteredDevices.length === 1) {
          title = ", das Aufmerksamkeit benötigt";
        } else {
          title = ", die Aufmerksamkeit benötigen";
        }
        break;
      case "isOnline":
        title = " online";
        break;
      case "isOffline":
        title = " offline";
        break;
    }

    return (
      <div className={`${!isLast && !isCollapsed ? "mb-5" : ""}`}>
        <div className="relative top-[26px] left-[52px] flex items-center">
          <Icon
            size={1}
            rotate={isCollapsed ? 180 : 0}
            path={mdiChevronDown}
            className="absolute left-2 -top-0.5 text-n-9 cursor-pointer hover:bg-n-6 rounded-md"
            onClick={() => toggleSection(key)}
          />
          <span className="text-n-9 font-300 bg-[#0e0c15] text-sm pl-9 pr-2 select-none">
            {filteredDevices.length} {deviceCountText} {title}
          </span>
        </div>
        <div className="mx-8 pt-10 mt-4 border-t border-n-5">
          {!isCollapsed && (
            <div className="gridcontainer select-none">
              {filteredDevices.map((device, index) => (
                <DeviceCard key={index} device={device} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const filters = {
    needsAttention: (device) =>
      (device.tankLevel === 0 && device.isActive === 1) || (device.batLevel && device.batLevel <= 5),
    isOnline: (device) =>
      device.tankLevel !== 0 && device.isActive === 1 && (device.batLevel > 5 || device.batLevel === null),
    isOffline: (device) => device.isActive === 0 && device.batLevel > 5,
  };

  return (
    <Section crossesOffset="lg:translate-y-[5rem]" customPaddings id="dashboard">
      <div className="md:mx-6 lg:mx-8 xl:mx-10 pt-20 pb-10 min-h-svh">
        {isLoaded ? (
          <div>
            <Icon
              size={1.25}
              path={mdiReload}
              className="fixed left-[285px] top-[17px] lg:left-[16px] xl:left-[26px] lg:top-[102px] text-n-4 cursor-pointer bg-n-6 hover:bg-n-5 rounded-md p-1 pl-1.5 z-50"
              onClick={() => fetchDevices()}
            />

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
              <div class="absolute h-10 w-10 border-4 border-n-6 rounded-full"></div>
              <div class="h-10 w-10 border-4 border-t-transparent border-n-2 rounded-full animate-spin"></div>
              <p className="body-2 z-10 text-n-2">Daten aktualisieren</p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Dashboard;
