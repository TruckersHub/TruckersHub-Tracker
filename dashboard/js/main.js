const dashboard = document.getElementById("dashboard");
const dashboardInner = document.querySelector("#dashboard .dashboard");
const bars = document.getElementById("bars");
const times = document.getElementById("times");
const menuu = document.getElementById("menu");

window.addEventListener("resize", resize);
resize();
function resize() {
    let scale,
        outer = document.getElementById("dashboard"),
        inner = document.querySelector("#dashboard .dashboard"),
        maxWidth = inner.clientWidth,
        maxHeight = inner.clientHeight,
        width = outer.clientWidth,
        height = outer.clientHeight,
        isMax = width >= maxWidth && height >= maxHeight;

    scale = Math.min(width / maxWidth, height / maxHeight);
    inner.style.transform = isMax ? 'translate(-50%, -50%)' : 'scale(' + scale + ') translate(-50%, -50%)';
}

function menu() {
    if (bars.style.display == "none") {
        bars.style = "display: block;";
        times.style = "display: none;";
        menuu.style = "display: none;";
        dashboard.style = "";
    } else {
        bars.style = "display: none;";
        times.style = "display: block;";
        menuu.style = "";
        dashboard.style = "display: none;";
    }
}

const skins = document.getElementById("skins");
const config = document.getElementById("config");
const about = document.getElementById("about");
const tabSkins = document.querySelector(`.tab-skins`);
const tabConfig = document.querySelector(`.tab-config`);
const tabAbout = document.querySelector(`.tab-about`);
function menuopt(id) {
    const nav = document.getElementById(id);
    const tab = document.querySelector(`.tab-${id}`);

    skins.classList.remove("active");
    config.classList.remove("active");
    about.classList.remove("active");
    nav.classList.add("active");

    tabSkins.style = "display: none;";
    tabConfig.style = "display: none;";
    tabAbout.style = "display: none;";
    tab.style = "";
}

const more = document.querySelectorAll(".more");
more.forEach(item => {
    item.addEventListener("click", () => {
        item.parentElement.classList.toggle("show");
        item.children[0].classList.toggle("fa-angle-double-right");
        item.children[0].classList.toggle("fa-angle-double-left");

        if (item.parentElement.classList.contains("show")) {
            item.parentElement.parentElement.children[1].style = "";
        } else {
            item.parentElement.parentElement.children[1].style = "display: none;";
        }
    })
});

function activate(dash) {
    dashboard.classList.forEach(i => {
        if (i != "wrapper") {
            dashboard.classList.remove(i);
        }
    })
    dashboard.classList.add(dash);
    bars.style = "display: block;";
    times.style = "display: none;";
    menuu.style = "display: none;";
    dashboard.style = "";

    dashSelection();
}

function dashSelection() {
    const dashList = document.getElementById("dashList");
    dashList.childNodes.forEach(c => {
        if (c.id) {
            if (c.classList.contains("active")) {
                const activateDiv = document.createElement("div");
                activateDiv.classList.add("card-footer");
                activateDiv.classList.add("d-flex");
                activateDiv.classList.add("justify-content-center");
                activateDiv.classList.add("align-items-center");
                activateDiv.innerHTML = `<a class="btn btn-sm btn-success" onclick="activate('${c.id}')">
                                            Activate
                                        </a>`;
                c.appendChild(activateDiv)
            }
            c.classList.remove("active");
            try {
                c.children[1].children[0].children[0].remove();
            } catch (error) { };
        }
    });

    const dashboards = ["default", "base", "daf-xf-dash"];
    let currentDashboard = "default";
    dashboard.classList.forEach(i => {
        if (dashboards.includes(i)) {
            currentDashboard = i;
        }
    });
    const dashboardSelection = document.getElementById(currentDashboard);
    dashboardSelection.classList.add("active");
    dashboardSelection.children[2].remove();
    const small = document.createElement("small");
    small.classList.add("mx-1");
    small.classList.add("badge");
    small.classList.add("badge-success");
    small.innerHTML = "Active";
    dashboardSelection.children[1].children[0].appendChild(small);

    resize();
}

(async function () {
    const body = await fetch("/config");
    const json = await body.json();

    console.log(json);

    dashboard.classList.add(json.general_skin_on_load);
    resize();
    dashSelection();


    const value = document.querySelectorAll(".value");
    value.forEach(select => {
        select.value = json[select.id];

        select.addEventListener("change", () => {
            json[select.id] = isNaN(select.value) ? select.value : parseInt(select.value);

            fetch("/config", {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    "content-type": "application/json"
                }
            })
        })
    })

    const input = document.querySelectorAll(".input-zone");
    input.forEach(i => {
        i.value = json[i.id];
    })

    const general_port_button = document.querySelector("button.general_port");
    general_port_button.addEventListener("click", () => {
        const general_port = document.getElementById("general_port");
        json[general_port.id] = parseInt(general_port.value);

        fetch("/config", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "content-type": "application/json"
            }
        })
    })

    // Events Switch
    const events = document.querySelectorAll(".events .switch");
    events.forEach(s => {
        try {
            if (json[s.id]) {
                s.children[0].classList.add("active");
                s.children[1].classList.remove("active");
            } else {
                s.children[0].classList.remove("active");
                s.children[1].classList.add("active");
            }

            s.children[0].addEventListener("click", () => {
                s.children[0].classList.add("active");
                s.children[1].classList.remove("active");
                json[s.id] = true;

                fetch("/config", {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        "content-type": "application/json"
                    }
                })
            })
            s.children[1].addEventListener("click", () => {
                s.children[0].classList.remove("active");
                s.children[1].classList.add("active");
                json[s.id] = false;

                fetch("/config", {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        "content-type": "application/json"
                    }
                })
            })
        } catch (error) { }
    })

    // Unit Switch
    const units = document.querySelectorAll(".units .switch");
    units.forEach(s => {
        try {
            if (json[s.id]) {
                document.getElementById(json[s.id]).classList.add("active");
            }

            s.children[0].addEventListener("click", () => {
                s.children[0].classList.add("active");
                s.children[1].classList.remove("active");
                json[s.id] = s.children[0].id;

                fetch("/config", {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        "content-type": "application/json"
                    }
                })
            })
            s.children[1].addEventListener("click", () => {
                s.children[0].classList.remove("active");
                s.children[1].classList.add("active");
                json[s.id] = s.children[1].id;

                fetch("/config", {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        "content-type": "application/json"
                    }
                })
            })
        } catch (error) { }
    })

    // Data Setting
    const hasJob = document.querySelector(".hasJob");
    const gameTime = document.querySelectorAll(".game-time");
    const dashboardd = document.querySelector(".dashboard");
    const truckSpeed = document.querySelector(".truck-speed");
    const engineRpm = document.querySelector(".truck-engineRpm");
    const speedRounded = document.querySelector(".truck-speedRounded");
    const speedRoundedUnit = document.querySelector(".truck-speedRounded-unit");
    const cruiseControlSpeedRounded = document.querySelector(".truck-cruiseControlSpeedRounded");
    const cruiseControlOn = document.querySelector(".truck-cruiseControlOn");
    const truckFuel = document.querySelector(".truck-fuel");
    const waterTemperature = document.querySelector(".truck-waterTemperature");
    const truckOdometer = document.querySelector(".truck-odometer");
    const truckGear = document.querySelector(".truck-gear");
    const blinkerLeft = document.querySelector(".truck-blinkerLeftOn");
    const blinkerRight = document.querySelector(".truck-blinkerRightOn");
    const lightsBeamHigh = document.querySelector(".truck-lightsBeamHighOn");
    const lightsBeamLow = document.querySelector(".truck-lightsBeamLowOn");
    const lightsParking = document.querySelector(".truck-lightsParkingOn");
    const trailerAttached = document.querySelector(".trailer-attached");
    const trailerMass = document.querySelector(".trailer-mass");
    const trailerName = document.querySelector(".trailer-name");
    const sourceCity = document.querySelector(".job-sourceCity");
    const sourceCompany = document.querySelector(".job-sourceCompany");
    const destinationCity = document.querySelector(".job-destinationCity");
    const destinationCompany = document.querySelector(".job-destinationCompany");
    const remainingTime = document.querySelector(".job-remainingTime");
    const jobIncome = document.querySelector(".job-income");
    const wear = document.querySelector(".wear");
    const trailerWear = document.querySelector(".trailer-wear");
    const parkBrakeOn = document.querySelector(".truck-parkBrakeOn");
    const airPressureWarningOn = document.querySelector(".truck-airPressureWarningOn");

    var source = new EventSource('/data')

    var data;
    source.addEventListener('message', function (e) {
        data = JSON.parse(e.data);

        gameTime.forEach(t => {
            t.innerHTML = new Date(data.game.time.unix).toLocaleString("en-GB", {
                timeZone: "Africa/Abidjan",
                hour12: true,
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit"
            });
        })

        if (data?.game?.sdkActive) {
            dashboardd.classList.add("game-connected");
            dashboardd.classList.add("yes");

            if (data.job.plannedDistance.km != 0) {
                hasJob.classList.add("yes");
                sourceCity.innerHTML = data.job.source.city.name;
                sourceCompany.innerHTML = data.job.source.company.name;
                destinationCity.innerHTML = data.job.destination.city.name;
                destinationCompany.innerHTML = data.job.destination.company.name;
                remainingTime.innerHTML = new Date(data.job.expectedDeliveryTimestamp.unix).toLocaleString("en-GB", {
                    timeZone: "Africa/Abidjan",
                    hour12: true,
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                })
                jobIncome.innerHTML = `${data.job.income.toLocaleString()} €`;
            } else {
                hasJob.classList.remove("yes");
                sourceCity.innerHTML = "";
                sourceCompany.innerHTML = "";
                destinationCity.innerHTML = "";
                destinationCompany.innerHTML = "";
                remainingTime.innerHTML = "";
                jobIncome.innerHTML = `0 €`;
            }

            if (!data.game.paused) {
                speedRounded.innerHTML = Math.round(data.truck.speed[json.unit_speed]);
                speedRoundedUnit.innerHTML = json.unit_speed == "kph" ? "km/h" : "mph";
                cruiseControlSpeedRounded.innerHTML = Math.round(data.truck.cruiseControl[json.unit_speed]);
                truckOdometer.innerHTML = json.unit_length == "m" ? Math.round(data.truck.odometer) + " km" : Math.round(data.truck.odometer * 0.621371) + " mi";
                truckGear.innerHTML = data.truck.transmission.gear.displayed == 0 ? "N" : data.truck.transmission.gear.displayed < 0 ? `R${String(data.truck.transmission.gear.displayed).split("-")[1]}` : data.truck.transmission.gear.displayed;;
                trailerMass.innerHTML = (data.job.cargo.mass / 1000).toFixed(1);
                trailerName.innerHTML = data.job.cargo.name;
                wear.innerHTML = Math.round(data.truck.damage.total * 100) + "%";
                trailerWear.innerHTML = Math.round(data.trailer.damage.total * 100) + "%";

                if (data.truck.cruiseControl.enabled) {
                    cruiseControlOn.classList.add("yes");
                } else {
                    cruiseControlOn.classList.remove("yes");
                }
                if (data.truck.lights.blinker.left.active) {
                    blinkerLeft.classList.add("yes");
                } else {
                    blinkerLeft.classList.remove("yes");
                }
                if (data.truck.lights.blinker.right.active) {
                    blinkerRight.classList.add("yes");
                } else {
                    blinkerRight.classList.remove("yes");
                }
                if (data.truck.lights.beamHigh.enabled) {
                    lightsBeamHigh.classList.add("yes");
                } else {
                    lightsBeamHigh.classList.remove("yes");
                }
                if (data.truck.lights.beamLow.enabled) {
                    lightsBeamLow.classList.add("yes");
                } else {
                    lightsBeamLow.classList.remove("yes");
                }
                if (data.truck.lights.parking.enabled) {
                    lightsParking.classList.add("yes");
                } else {
                    lightsParking.classList.remove("yes");
                }
                if (data.trailer.attached) {
                    trailerAttached.classList.add("yes");
                } else {
                    trailerAttached.classList.remove("yes");
                }
                if (data.truck.brakes.parking.enabled) {
                    parkBrakeOn.classList.add("yes");
                } else {
                    parkBrakeOn.classList.remove("yes");
                }
                if (data.truck.brakes.airPressure.warning.enabled) {
                    airPressureWarningOn.classList.add("yes");
                } else {
                    airPressureWarningOn.classList.remove("yes");
                }

                const dashboardData = {
                    default: {
                        topSpeed: 140,
                        speedDeg: 228,
                        speedMin: 114,
                        topRPM: 2400,
                        rpmDeg: 192,
                        rpmMin: 96,
                        fuelDeg: 95,
                        fuelMin: 95,
                        topTemp: 200,
                        tempDeg: 95,
                        tempMin: 95
                    },
                    "daf-xf-dash": {
                        topSpeed: 140,
                        speedDeg: 212,
                        speedMin: 120,
                        topRPM: 2500,
                        rpmDeg: 245,
                        rpmMin: 120,
                        fuelDeg: -55,
                        fuelMin: 65,
                        topTemp: 200,
                        tempDeg: 65,
                        tempMin: 120
                    }
                };
                let currentDashboard = "default";
                dashboard.classList.forEach(i => {
                    if (dashboardData[i]) {
                        currentDashboard = i;
                    }
                });
                const speedDeg = data.truck.speed[json.unit_speed] > dashboardData[currentDashboard].topSpeed
                    ? dashboardData[currentDashboard].speedDeg
                    : (((parseInt(data.truck.speed[json.unit_speed]) / dashboardData[currentDashboard].topSpeed) * dashboardData[currentDashboard].speedDeg) - dashboardData[currentDashboard].speedMin);
                truckSpeed.style = `transform: rotate(${speedDeg}deg);`;

                const rpmDeg = (((data.truck.engine.rpm.value / dashboardData[currentDashboard].topRPM) * dashboardData[currentDashboard].rpmDeg) - dashboardData[currentDashboard].rpmMin);
                engineRpm.style = `transform: rotate(${rpmDeg}deg);`;

                const fuelDeg = (((data.truck.fuel.value / data.truck.fuel.capacity) * dashboardData[currentDashboard].fuelDeg) - dashboardData[currentDashboard].fuelMin);
                truckFuel.style = `transform: rotate(${fuelDeg}deg);`;

                const waterTempDeg = (((data.truck.engine.waterTemperature.value / 200) * dashboardData[currentDashboard].tempDeg) - dashboardData[currentDashboard].tempMin);
                waterTemperature.style = `transform: rotate(${waterTempDeg}deg);`;
            }
        }
    }, false)
})();


// FullScreen
function toggleFullscreen(elem) {
    if (elem.children[0].children[0].classList.contains("fa-expand")) {
        elem.children[0].children[0].classList.toggle("fa-expand");
        elem.children[0].children[0].classList.toggle("fa-compress");
        document.documentElement.requestFullscreen();
    } else {
        elem.children[0].children[0].classList.toggle("fa-expand");
        elem.children[0].children[0].classList.toggle("fa-compress");
        document.exitFullscreen();
    }
}