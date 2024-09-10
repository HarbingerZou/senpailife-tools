interface TimelineEvent {
    start: Date;
    end: Date;
    title: string;
    imageUrl:string
}

interface EventsFromAllServer{
    America:TimelineEvent[][]
    Europe:TimelineEvent[][]
    Asia:TimelineEvent[][]
    TW_HK_MO:TimelineEvent[][]
    China:TimelineEvent[][]
}

interface ServerEventData {
    cct_author_id: string;
    cct_created: string; // Date in "YYYY-MM-DD HH:MM:SS" format
    cct_modified: string; // Date in "YYYY-MM-DD HH:MM:SS" format
    cct_slug: string;
    cct_status: string;
    end_time: string; // Date in "YYYY-MM-DD" format
    event_name: string;
    event_picture: string; // URL string
    server_type: string;
    start_time: string; // Date in "YYYY-MM-DD" format
    _ID: string;
}


const dayWidth = 36
const eventHeight =  50
const eventGapHeight = 10
const containerBoxPadding = 20
const MonthAndDayTextHeight = 90
const LineLengthButtom = 15

var SelectedServer:string = "America"

const allServerEvents:EventsFromAllServer = {
    America:[],
    Europe:[],
    Asia:[],
    TW_HK_MO:[],
    China:[]
}

let events:TimelineEvent[][];

const startDate = new Date('2024-08-01T00:00:00'); // Local time
const endDate = new Date('2024-09-15T23:59:59'); // Local time
const dayCount: number = (endDate.getTime() - startDate.getTime()) / (86400000) + 1;


document.addEventListener('DOMContentLoaded', async () => {
    const response:Response = await fetch("https://skhyngsr8d.onrocket.site/wp-json/api/server-events/")
    const data:ServerEventData[] = await response.json()
    console.log(data)

    for(const entry of data){
        const timeLineEvent:TimelineEvent = {start:parseTime(entry.start_time, entry.server_type),
            end:parseTime(entry.end_time, entry.server_type),
            title:entry.event_name,
            imageUrl:entry.event_picture
        }
        if(entry.server_type === "America"){
            allServerEvents.America.push([timeLineEvent])
        }else if(entry.server_type === "Europe"){
            allServerEvents.Europe.push([timeLineEvent])
        }else if(entry.server_type === "Asia"){
            allServerEvents.Asia.push([timeLineEvent])
        }else if(entry.server_type === "TW"){
            allServerEvents.TW_HK_MO.push([timeLineEvent])
        }else if(entry.server_type === "China"){
            allServerEvents.China.push([timeLineEvent])
        }
    }

    if(SelectedServer === "America"){
        events = allServerEvents.America
        console.log("America")
    }else if(SelectedServer === "Europe"){
        events = allServerEvents.Europe
        console.log("Europe")
    }else if(SelectedServer === "Asia"){
        events = allServerEvents.Asia
        console.log("Asia")
    }else if(SelectedServer === "TW, HK, MO"){
        events = allServerEvents.TW_HK_MO
        console.log("TW HK MO")
    }else{
        events = allServerEvents.China
        console.log("China")
    }


    const canvas = paintCanvas(events, startDate, endDate, dayCount)
    const page:HTMLElement = document.getElementById('page')!
    page.appendChild(canvas)
});


function parseTime(datetimeStr: string, serverType: string): Date {
    // Determine the server's timezone based on server type
    let timezone: string;

    if (serverType === 'Europe') {
        timezone = 'Europe/Berlin'; // Example: Berlin for Europe (GMT+1)
    } else if (serverType === 'America') {
        timezone = 'America/New_York'; // Example: New York for America (GMT-5)
    } else {
        //Asia, TW, HK MO, China
        timezone = 'Asia/Shanghai'; // Example: Shanghai for Asia (GMT+8)
    }    
    //console.log(datetimeStr);
    //console.log(serverType);
    
    // Parse the datetime string using the correct timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
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
    const parts = formatter.formatToParts(new Date(datetimeStr));
    const dateString = parts.reduce((acc, part) => acc + part.value, '');
    
    // Create a Date object from the formatted string
    const time = new Date(dateString);
    
    console.log(time);
    return time;
}


function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownMenu")!;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  }
  
function updateState(value:string) {
    console.log("Selected:", value); // You can replace this with any state management code
    SelectedServer = value
    if(SelectedServer === "America"){
        events = allServerEvents.America
        console.log("America")
    }else if(SelectedServer === "Europe"){
        events = allServerEvents.Europe
        console.log("Europe")
    }else if(SelectedServer === "Asia"){
        events = allServerEvents.Asia
        console.log("Asia")
    }else if(SelectedServer === "TW, HK, MO"){
        events = allServerEvents.TW_HK_MO
        console.log("TW HK MO")
    }else{
        events = allServerEvents.China
        console.log("China")
    }
    const oldCanvas:HTMLElement = document.getElementById("containerBox")!
    const page:HTMLElement = document.getElementById('page')!
    page.removeChild(oldCanvas)

    const canvas = paintCanvas(events, startDate, endDate, dayCount)
    page.appendChild(canvas)

    const button = document.getElementById('dropbtn')!
    button.innerText = value
    toggleDropdown()
}

function paintCanvas(events:TimelineEvent[][], startDate:Date, endDate:Date, dayCount:number):HTMLElement{    
    const containerBox: HTMLElement = document.createElement('div');
    containerBox.id = "containerBox";
    console.log("container box should be created")
    
    const contentWidth:number = dayCount*dayWidth
    const contentHeight:number = events.length*(eventHeight+eventGapHeight)+MonthAndDayTextHeight+LineLengthButtom
    containerBox.style.height = `${contentHeight+containerBoxPadding*2}px`
    containerBox.style.width = `${contentWidth+containerBoxPadding*2}px`

    
    const background:HTMLElement = Background(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight)
    containerBox.appendChild(background)

    const content:HTMLElement = Content(startDate, endDate, dayCount, containerBoxPadding, contentWidth, contentHeight, events)
    containerBox.appendChild(content)
    return containerBox
}   

function Content(startDate:Date, endDate:Date, dayCount:number, containerBoxPadding:number, contentWidth:number, contentHeight:number, events:TimelineEvent[][]):HTMLElement{
    const content:HTMLElement = document.createElement('div');
    content.id = "content"
    content.style.width = `${contentWidth}px`
    content.style.margin = `${containerBoxPadding}px`
    content.style.height = `${contentHeight}px`

    const currentTimeLine = CurrentTimeLine(startDate, endDate,dayCount, contentWidth)
    content.appendChild(currentTimeLine)

    const eventAllLines = EventAllLines(events, startDate, dayCount, contentWidth)
    content.appendChild(eventAllLines)

    return content
}

function EventAllLines(eventss:TimelineEvent[][], startDate:Date, dayCount:number, contentWidth:number){
    const container:HTMLElement = document.createElement('div')
    container.id = 'events-container'
    container.style.display = 'flex'
    container.style.flexDirection = `column`
    container.style.gap = `${eventGapHeight}px`
    container.style.paddingTop = `${MonthAndDayTextHeight}px`
    for(const events of eventss){
        const eventsInSingleLine:HTMLElement = EventsInSingleLine(events, startDate, dayCount, contentWidth)
        container.appendChild(eventsInSingleLine)
    }
    return container
}

function EventsInSingleLine(eventsList: TimelineEvent[], startDate: Date, dayCount: number, contentWidth: number): HTMLElement {
    const rowContainer = document.createElement('div');
    rowContainer.style.height = `${eventHeight}px`;

    for (const eventItem of eventsList) {
        const eventStartDate: Date = eventItem.start;
        const eventEndDate: Date = eventItem.end;

        const startX = Math.max(getCanvasPosition(eventStartDate, startDate, dayCount, contentWidth), dayWidth / 2);
        const endX = Math.min(getCanvasPosition(eventEndDate, startDate, dayCount, contentWidth), contentWidth - dayWidth / 2);
        const width = endX - startX;

        const banner: HTMLElement = document.createElement('div');
        banner.style.width = `${width}px`;
        banner.style.marginLeft = `${startX}px`;
        banner.className = 'banner';

        const pictureLengthInRem = 9;

        // Create a div for the background layer
        const bannerBackgroundLayer: HTMLElement = document.createElement('div');
        bannerBackgroundLayer.className = 'banner-background-layer';

        // Set the width of the background layer to pictureLengthInRem
        bannerBackgroundLayer.style.width = `${pictureLengthInRem}rem`;

        // Create a div for the text layer
        const bannerTextLayer: HTMLElement = document.createElement('div');
        bannerTextLayer.className = 'banner-text-layer';

        // Append the event title text
        const bannerText: HTMLElement = document.createElement('p');
        bannerText.className = 'banner-text';
        bannerText.innerText = eventItem.title;
        
        bannerTextLayer.appendChild(bannerText);

        // Append both layers to the banner
        banner.appendChild(bannerBackgroundLayer);
        banner.appendChild(bannerTextLayer);
        
        rowContainer.appendChild(banner);

        const pictureUrl = "https://picsum.photos/200/300"
        // Fetch the dominant color from the image URL
        getDominantColorFromUrl(pictureUrl, (dominantColor) => {
            // Apply a gradient that fades from the dominant color (right) to transparent (left)
            bannerBackgroundLayer.style.backgroundImage = `linear-gradient(to left, rgba(${dominantColor}, 0) 0%, rgb(${dominantColor}) 100%), url(${pictureUrl})`;
            bannerBackgroundLayer.style.backgroundSize = `cover`; // Ensure the image fits the layer
            bannerBackgroundLayer.style.backgroundPosition = 'right center'; // Align image to the right
            bannerBackgroundLayer.style.backgroundRepeat = 'no-repeat';
            banner.style.backgroundColor = `rgb(${dominantColor})`
        });
    }

    return rowContainer;
}


function getDominantColorFromUrl(imageUrl: string, callback: (dominantColor: string) => void): void {
    // Create an image element
    const img = new Image();
    img.crossOrigin = "Anonymous"; // This allows loading from different origins if necessary
    img.src = imageUrl;

    // Once the image is loaded, calculate the dominant color
    img.onload = () => {
        // Create a canvas element to draw the image and extract pixel data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Object to store the frequency of each color
        const colorCount: { [key: string]: number } = {};
        let dominantColor = '';
        let maxCount = 0;

        // Helper function to bucket colors (rounding to the nearest 10 or so)
        function simplifyColorValue(value: number): number {
            return Math.floor(value / 10) * 10; // Round to the nearest 10 to reduce variations
        }

        // Iterate through pixel data to count the frequency of each RGB color
        for (let i = 0; i < data.length; i += 4) {
            const r = simplifyColorValue(data[i]);
            const g = simplifyColorValue(data[i + 1]);
            const b = simplifyColorValue(data[i + 2]);
            const color = `${r},${g},${b}`;

            // Count the color frequency
            colorCount[color] = (colorCount[color] || 0) + 1;

            // Check if it's the most frequent color
            if (colorCount[color] > maxCount) {
                maxCount = colorCount[color];
                dominantColor = color;
            }
        }

        // Return the dominant color in the format 'rgb(r, g, b)'
        callback(`${dominantColor}`);
    };

    img.onerror = () => {
        console.error('Error loading image:', imageUrl);
        callback('0,0,0'); // Fallback in case the image fails to load
    };
}


function generateLowSaturationRGB(opacity:number) {
    // Generate a base value between 50 and 200 to avoid extremes (too dark or too bright)
    const base = Math.floor(Math.random() * 101) + 100;
    
    // Generate slight variations around the base value for low saturation
    const variation = Math.floor(Math.random() * 51) - 25; // Variation range between -30 to 30
    
    // Calculate the RGB values with low saturation but still some color
    let r = Math.min(255, Math.max(0, base + variation));
    let g = Math.min(255, Math.max(0, base + variation));
    let b = Math.min(255, Math.max(0, base + variation));

    // Introduce a small random shift to one of the RGB components for subtle color
    const colorShift = Math.floor(Math.random() * 3);
    if (colorShift === 0) r += 15;
    if (colorShift === 1) g += 15;
    if (colorShift === 2) b += 15;
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function CurrentTimeLine(startDate:Date, endDate:Date, dayCount:number, contentWidth:number){
    const line:HTMLElement = document.createElement('div')
    line.id = 'current-time'
    const lineText:HTMLElement = document.createElement('p');
    lineText.id = 'current-time-text'

    const lineGraph: HTMLElement = document.createElement('div');
    lineGraph.id = 'current-time-line';

    line.appendChild(lineText)
    line.appendChild(lineGraph)

    function updateCurrentTimeLine() {
        const currentTime = new Date();
        lineText.textContent = currentTime.toLocaleTimeString()
        //console.log(currentTime)
        if (currentTime.getTime() <= endDate.getTime() && currentTime.getTime() >= startDate.getTime()) {
            const left = getCanvasPosition(currentTime, startDate, dayCount, contentWidth)
            line.style.left = `${left}px`;
        }
    }
    setInterval(updateCurrentTimeLine, 1000);

    // Initial update to set the position of the line
    updateCurrentTimeLine();
    return line
}

function getCanvasPosition(targetDate:Date, startDate:Date, dayCount:number, contentWidth:number):number{
    const dayBefore = (targetDate.getTime() - startDate.getTime()) / 86400000;
    const percentage = dayBefore / dayCount;
    const position = percentage * contentWidth+dayWidth/2;
    return position
}

function Background(startDate:Date, endDate:Date, dayCount:number, containerBoxPadding:number, contentWidth:number, contentHeight:number):HTMLElement{
    const timeline: HTMLElement = document.createElement('div');
    timeline.id = 'timeline'
    timeline.style.width = `${contentWidth}px`
    timeline.style.padding = `${containerBoxPadding}px`
    timeline.style.height = `${contentHeight}px`

    let currentMonth: number = startDate.getMonth();
    let monthStartIndex: number = 0;

    for (let i = 0; i < dayCount; i++) {
        const currentDay: Date = new Date(startDate.getTime() + i * 86400000);
        if (currentDay.getMonth() !== currentMonth) {
            const monthDayCount:number = i - monthStartIndex
            const monthstartDate:Date = new Date(startDate.getTime() + monthStartIndex * 86400000);
            const singleMonthAndDaysArea:HTMLElement = SingleMonthAndDaysArea(monthstartDate, monthDayCount)

            timeline.appendChild(singleMonthAndDaysArea); 

            currentMonth = currentDay.getMonth();
            monthStartIndex = i;
        }
    }

    const monthDayCount:number = dayCount - monthStartIndex
    const monthstartDate:Date = new Date(startDate.getTime() + monthStartIndex * 86400000);
    const singleMonthAndDaysArea:HTMLElement = SingleMonthAndDaysArea(monthstartDate, monthDayCount)

    timeline.appendChild(singleMonthAndDaysArea); 
    return timeline
}

function SingleMonthAndDaysArea(startDate:Date, dayCount:number):HTMLElement{
    const area: HTMLElement = document.createElement('div');
    area.className = 'month-days'

    const monthDiv: HTMLElement = document.createElement('div');
    monthDiv.className = 'month-area';
    monthDiv.style.width = `${(dayCount) * dayWidth}px`; 

    const monthText: HTMLElement = document.createElement('p')
    monthText.className = 'month-label'
    monthText.textContent = startDate.toLocaleString('default', { month: 'long' });

    monthDiv.appendChild(monthText)

    area.appendChild(monthDiv)

    const dayArea = DayBackGround(dayCount, startDate)
    area.appendChild(dayArea)
    return area
}

function DayBackGround(dayCount:number, startDate:Date):HTMLElement{
    const dayArea:HTMLElement = document.createElement('div')
    dayArea.className = 'days'
    for (let i = 0; i < dayCount; i++) {
        const currentDay: Date = new Date(startDate.getTime() + i * 86400000);
        const dayElement:HTMLElement = Day(currentDay)
        dayArea.appendChild(dayElement);
    }
    return dayArea

}

function Day(currentDay:Date):HTMLElement{
    const day = document.createElement(`div`)
    day.classList.add('day')
    day.style.width = `${dayWidth}px`
    day.style.minWidth = `${dayWidth}px`

    const dayText: HTMLElement = document.createElement('p');
    dayText.classList.add('dayText');
    dayText.textContent = currentDay.getDate().toString();
    day.appendChild(dayText);

    const dayLine: HTMLElement = document.createElement('div')
    dayLine.classList.add('dayLine')

    day.appendChild(dayText)
    day.appendChild(dayLine)
    return day
}
