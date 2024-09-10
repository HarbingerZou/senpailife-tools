"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var dayWidth = 36;
var eventHeight = 50;
var eventGapHeight = 10;
var containerBoxPadding = 20;
var MonthAndDayTextHeight = 90;
var LineLengthButtom = 15;
var SelectedServer = "America";
var allServerEvents = {
    America: [],
    Europe: [],
    Asia: [],
    TW_HK_MO: [],
    China: []
};
var events;
var startDate = new Date('2024-08-01T00:00:00'); // Local time
var endDate = new Date('2024-09-15T23:59:59'); // Local time
var dayCount = (endDate.getTime() - startDate.getTime()) / (86400000) + 1;
document.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, _i, data_1, entry, timeLineEvent, canvas, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://skhyngsr8d.onrocket.site/wp-json/api/server-events/")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                console.log(data);
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    entry = data_1[_i];
                    timeLineEvent = { start: parseTime(entry.start_time, entry.server_type),
                        end: parseTime(entry.end_time, entry.server_type),
                        title: entry.event_name,
                        imageUrl: entry.event_picture
                    };
                    if (entry.server_type === "America") {
                        allServerEvents.America.push([timeLineEvent]);
                    }
                    else if (entry.server_type === "Europe") {
                        allServerEvents.Europe.push([timeLineEvent]);
                    }
                    else if (entry.server_type === "Asia") {
                        allServerEvents.Asia.push([timeLineEvent]);
                    }
                    else if (entry.server_type === "TW") {
                        allServerEvents.TW_HK_MO.push([timeLineEvent]);
                    }
                    else if (entry.server_type === "China") {
                        allServerEvents.China.push([timeLineEvent]);
                    }
                }
                if (SelectedServer === "America") {
                    events = allServerEvents.America;
                    console.log("America");
                }
                else if (SelectedServer === "Europe") {
                    events = allServerEvents.Europe;
                    console.log("Europe");
                }
                else if (SelectedServer === "Asia") {
                    events = allServerEvents.Asia;
                    console.log("Asia");
                }
                else if (SelectedServer === "TW, HK, MO") {
                    events = allServerEvents.TW_HK_MO;
                    console.log("TW HK MO");
                }
                else {
                    events = allServerEvents.China;
                    console.log("China");
                }
                canvas = paintCanvas(events, startDate, endDate, dayCount);
                page = document.getElementById('page');
                page.appendChild(canvas);
                return [2 /*return*/];
        }
    });
}); });
function parseTime(datetimeStr, serverType) {
    // Determine the server's timezone based on server type
    var timezone;
    if (serverType === 'Europe') {
        timezone = 'Europe/Berlin'; // Example: Berlin for Europe (GMT+1)
    }
    else if (serverType === 'America') {
        timezone = 'America/New_York'; // Example: New York for America (GMT-5)
    }
    else {
        //Asia, TW, HK MO, China
        timezone = 'Asia/Shanghai'; // Example: Shanghai for Asia (GMT+8)
    }
    //console.log(datetimeStr);
    //console.log(serverType);
    // Parse the datetime string using the correct timezone
    var formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    // Format the date as an array of parts, then reassemble it
    var parts = formatter.formatToParts(new Date(datetimeStr));
    var dateString = parts.reduce(function (acc, part) { return acc + part.value; }, '');
    // Create a Date object from the formatted string
    var time = new Date(dateString);
    console.log(time);
    return time;
}
function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownMenu");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    }
    else {
        dropdownContent.style.display = "block";
    }
}
function updateState(value) {
    console.log("Selected:", value); // You can replace this with any state management code
    SelectedServer = value;
    if (SelectedServer === "America") {
        events = allServerEvents.America;
        console.log("America");
    }
    else if (SelectedServer === "Europe") {
        events = allServerEvents.Europe;
        console.log("Europe");
    }
    else if (SelectedServer === "Asia") {
        events = allServerEvents.Asia;
        console.log("Asia");
    }
    else if (SelectedServer === "TW, HK, MO") {
        events = allServerEvents.TW_HK_MO;
        console.log("TW HK MO");
    }
    else {
        events = allServerEvents.China;
        console.log("China");
    }
    var oldCanvas = document.getElementById("containerBox");
    var page = document.getElementById('page');
    page.removeChild(oldCanvas);
    var canvas = paintCanvas(events, startDate, endDate, dayCount);
    page.appendChild(canvas);
    var button = document.getElementById('dropbtn');
    button.innerText = value;
    toggleDropdown();
}
function paintCanvas(events, startDate, endDate, dayCount) {
    var containerBox = document.createElement('div');
    containerBox.id = "containerBox";
    console.log("container box should be created");
    var contentWidth = dayCount * dayWidth;
    var contentHeight = events.length * (eventHeight + eventGapHeight) + MonthAndDayTextHeight + LineLengthButtom;
    containerBox.style.height = "".concat(contentHeight + containerBoxPadding * 2, "px");
    containerBox.style.width = "".concat(contentWidth + containerBoxPadding * 2, "px");
    var background = Background(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight);
    containerBox.appendChild(background);
    var content = Content(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight, events);
    containerBox.appendChild(content);
    return containerBox;
}
function Content(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight, events) {
    var content = document.createElement('div');
    content.id = "content";
    content.style.width = "".concat(contentWidth, "px");
    content.style.margin = "".concat(containerBoxPadding, "px");
    content.style.height = "".concat(contentHeight, "px");
    var currentTimeLine = CurrentTimeLine(startDate, endDate, dayCount, contentWidth);
    content.appendChild(currentTimeLine);
    var eventAllLines = EventAllLines(events, startDate, dayCount, contentWidth);
    content.appendChild(eventAllLines);
    return content;
}
function EventAllLines(eventss, startDate, dayCount, contentWidth) {
    var container = document.createElement('div');
    container.id = 'events-container';
    container.style.display = 'flex';
    container.style.flexDirection = "column";
    container.style.gap = "".concat(eventGapHeight, "px");
    container.style.paddingTop = "".concat(MonthAndDayTextHeight, "px");
    for (var _i = 0, eventss_1 = eventss; _i < eventss_1.length; _i++) {
        var events_1 = eventss_1[_i];
        var eventsInSingleLine = EventsInSingleLine(events_1, startDate, dayCount, contentWidth);
        container.appendChild(eventsInSingleLine);
    }
    return container;
}
function EventsInSingleLine(eventsList, startDate, dayCount, contentWidth) {
    var rowContainer = document.createElement('div');
    rowContainer.style.height = "".concat(eventHeight, "px");
    var _loop_1 = function (eventItem) {
        var eventStartDate = eventItem.start;
        var eventEndDate = eventItem.end;
        var startX = Math.max(getCanvasPosition(eventStartDate, startDate, dayCount, contentWidth), dayWidth / 2);
        var endX = Math.min(getCanvasPosition(eventEndDate, startDate, dayCount, contentWidth), contentWidth - dayWidth / 2);
        var width = endX - startX;
        var banner = document.createElement('div');
        banner.style.width = "".concat(width, "px");
        banner.style.marginLeft = "".concat(startX, "px");
        banner.className = 'banner';
        var pictureLengthInRem = 9;
        // Create a div for the background layer
        var bannerBackgroundLayer = document.createElement('div');
        bannerBackgroundLayer.className = 'banner-background-layer';
        // Set the width of the background layer to pictureLengthInRem
        bannerBackgroundLayer.style.width = "".concat(pictureLengthInRem, "rem");
        // Create a div for the text layer
        var bannerTextLayer = document.createElement('div');
        bannerTextLayer.className = 'banner-text-layer';
        // Append the event title text
        var bannerText = document.createElement('p');
        bannerText.className = 'banner-text';
        bannerText.innerText = eventItem.title;
        bannerTextLayer.appendChild(bannerText);
        // Append both layers to the banner
        banner.appendChild(bannerBackgroundLayer);
        banner.appendChild(bannerTextLayer);
        rowContainer.appendChild(banner);
        var pictureUrl = "https://picsum.photos/200/300";
        // Fetch the dominant color from the image URL
        getAverageColorFromUrl(pictureUrl, function (dominantColor) {
            // Apply a gradient that fades from the dominant color (right) to transparent (left)
            bannerBackgroundLayer.style.backgroundImage = "linear-gradient(to left, rgba(".concat(dominantColor, ", 0) 0%, rgb(").concat(dominantColor, ") 100%), url(").concat(pictureUrl, ")");
            bannerBackgroundLayer.style.backgroundSize = "cover"; // Ensure the image fits the layer
            bannerBackgroundLayer.style.backgroundPosition = 'right center'; // Align image to the right
            bannerBackgroundLayer.style.backgroundRepeat = 'no-repeat';
            banner.style.backgroundColor = "rgb(".concat(dominantColor, ")");
        });
    };
    for (var _i = 0, eventsList_1 = eventsList; _i < eventsList_1.length; _i++) {
        var eventItem = eventsList_1[_i];
        _loop_1(eventItem);
    }
    return rowContainer;
}
function getAverageColorFromUrl(imageUrl, callback) {
    // Create an image element
    var img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = imageUrl;

    // Once the image is loaded, calculate the average color
    img.onload = function () {
        // Create a canvas element to draw the image and extract pixel data
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Get pixel data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        // Variables to store the sum of all R, G, B values
        var rTotal = 0, gTotal = 0, bTotal = 0;
        var pixelCount = 0;

        // Iterate through pixel data and sum up all the RGB values
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];

            // Sum the red, green, and blue values
            rTotal += r;
            gTotal += g;
            bTotal += b;

            // Count the number of pixels processed
            pixelCount++;
        }

        // Calculate the average RGB values
        var rAvg = Math.round(rTotal / pixelCount);
        var gAvg = Math.round(gTotal / pixelCount);
        var bAvg = Math.round(bTotal / pixelCount);

        // Return the average color in the format 'rgb(r, g, b)'
        callback(`${rAvg},${gAvg},${bAvg}`);
    };

    // Error handling in case the image fails to load
    img.onerror = function () {
        console.error('Error loading image:', imageUrl);
        callback('0, 0, 0'); // Fallback in case the image fails to load
    };
}

function generateLowSaturationRGB(opacity) {
    // Generate a base value between 50 and 200 to avoid extremes (too dark or too bright)
    var base = Math.floor(Math.random() * 101) + 100;
    // Generate slight variations around the base value for low saturation
    var variation = Math.floor(Math.random() * 51) - 25; // Variation range between -30 to 30
    // Calculate the RGB values with low saturation but still some color
    var r = Math.min(255, Math.max(0, base + variation));
    var g = Math.min(255, Math.max(0, base + variation));
    var b = Math.min(255, Math.max(0, base + variation));
    // Introduce a small random shift to one of the RGB components for subtle color
    var colorShift = Math.floor(Math.random() * 3);
    if (colorShift === 0)
        r += 15;
    if (colorShift === 1)
        g += 15;
    if (colorShift === 2)
        b += 15;
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(opacity, ")");
}
function CurrentTimeLine(startDate, endDate, dayCount, contentWidth) {
    var line = document.createElement('div');
    line.id = 'current-time';
    var lineText = document.createElement('p');
    lineText.id = 'current-time-text';
    var lineGraph = document.createElement('div');
    lineGraph.id = 'current-time-line';
    line.appendChild(lineText);
    line.appendChild(lineGraph);
    function updateCurrentTimeLine() {
        var currentTime = new Date();
        lineText.textContent = currentTime.toLocaleTimeString();
        //console.log(currentTime)
        if (currentTime.getTime() <= endDate.getTime() && currentTime.getTime() >= startDate.getTime()) {
            var left = getCanvasPosition(currentTime, startDate, dayCount, contentWidth);
            line.style.left = "".concat(left, "px");
        }
    }
    setInterval(updateCurrentTimeLine, 1000);
    // Initial update to set the position of the line
    updateCurrentTimeLine();
    return line;
}
function getCanvasPosition(targetDate, startDate, dayCount, contentWidth) {
    var dayBefore = (targetDate.getTime() - startDate.getTime()) / 86400000;
    var percentage = dayBefore / dayCount;
    var position = percentage * contentWidth + dayWidth / 2;
    return position;
}
function Background(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight) {
    var timeline = document.createElement('div');
    timeline.id = 'timeline';
    timeline.style.width = "".concat(contentWidth, "px");
    timeline.style.padding = "".concat(containerBoxPadding, "px");
    timeline.style.height = "".concat(contentHeight, "px");
    var currentMonth = startDate.getMonth();
    var monthStartIndex = 0;
    for (var i = 0; i < dayCount; i++) {
        var currentDay = new Date(startDate.getTime() + i * 86400000);
        if (currentDay.getMonth() !== currentMonth) {
            var monthDayCount_1 = i - monthStartIndex;
            var monthstartDate_1 = new Date(startDate.getTime() + monthStartIndex * 86400000);
            var singleMonthAndDaysArea_1 = SingleMonthAndDaysArea(monthstartDate_1, monthDayCount_1);
            timeline.appendChild(singleMonthAndDaysArea_1);
            currentMonth = currentDay.getMonth();
            monthStartIndex = i;
        }
    }
    var monthDayCount = dayCount - monthStartIndex;
    var monthstartDate = new Date(startDate.getTime() + monthStartIndex * 86400000);
    var singleMonthAndDaysArea = SingleMonthAndDaysArea(monthstartDate, monthDayCount);
    timeline.appendChild(singleMonthAndDaysArea);
    return timeline;
}
function SingleMonthAndDaysArea(startDate, dayCount) {
    var area = document.createElement('div');
    area.className = 'month-days';
    var monthDiv = document.createElement('div');
    monthDiv.className = 'month-area';
    monthDiv.style.width = "".concat((dayCount) * dayWidth, "px");
    var monthText = document.createElement('p');
    monthText.className = 'month-label';
    monthText.textContent = startDate.toLocaleString('default', { month: 'long' });
    monthDiv.appendChild(monthText);
    area.appendChild(monthDiv);
    var dayArea = DayBackGround(dayCount, startDate);
    area.appendChild(dayArea);
    return area;
}
function DayBackGround(dayCount, startDate) {
    var dayArea = document.createElement('div');
    dayArea.className = 'days';
    for (var i = 0; i < dayCount; i++) {
        var currentDay = new Date(startDate.getTime() + i * 86400000);
        var dayElement = Day(currentDay);
        dayArea.appendChild(dayElement);
    }
    return dayArea;
}
function Day(currentDay) {
    var day = document.createElement("div");
    day.classList.add('day');
    day.style.width = "".concat(dayWidth, "px");
    day.style.minWidth = "".concat(dayWidth, "px");
    var dayText = document.createElement('p');
    dayText.classList.add('dayText');
    dayText.textContent = currentDay.getDate().toString();
    day.appendChild(dayText);
    var dayLine = document.createElement('div');
    dayLine.classList.add('dayLine');
    day.appendChild(dayText);
    day.appendChild(dayLine);
    return day;
}
