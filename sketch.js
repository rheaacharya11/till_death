// Artist's statement

// Credits: World Widows Report for data
// Used ChatGPT for debugging and some template code
// Took a lot of inspiration from Juji's framework and from the scrollytelling from class.
// also got data from this https://www.cdc.gov/nchs/data/hestat/mortality/mortality_marital_status_10_17.html 
// https://www.cdc.gov/nchs/data/nvsr/nvsr70/nvsr70-10.pdf
// I did all my data analysis in my ipynb which I can submit as well !
// I also used an ASCII art generator online.

// inspired by NYT's chart guessing game that we saw in class about the education vs income level

let canvasWidth, canvasHeight;
let canvasTopMargin = 50; // Top margin for the canvas
let canvasBottomMargin = 50; // Bottom margin for the canvas
let scrollY = 0; // Tracks how far we've scrolled
let maxScroll = 16000; // Maximum scrollable height for this content
let ratio;
let scrollbarHeight, scrollbarWidth;
let draggingScrollbar = false;
let scrollbarY = 0; // The vertical position of the scrollbar handle
let lastMouseY = 0;
let sliders = []; // Array to store the sliders
let userSelections = []; // Store user-selected heights
let showComparison = false;
let flowers = [];
let flowersInitialized = false;
let flowerCount = 10;
let checkButton;
let dotAnimationProgress = 0; // Counter to control the animation
let animationSpeed = 10; 
let checkboxes = [];
let activeCategories = [true, true, true, true, true]; // Track active categories
let score = 0;
let totalScore = 0;
let buttons = [];


let data; // Variable to hold the CSV data
let continentColors = {
  "Africa": '#f3c995', // Warmer and brighter
  "Asia": '#d17878',   // More vibrant red-pink
  "Europe": '#98cfc6', // Slightly deeper teal
  "North America": '#867b99', // Darker and more distinct purple
  "South America": '#9f7f7f'  // Deeper and richer mauve
};

let pieColors = {
  "Africa": ['#9a6a3f', '#d0873e', '#e5b77a', '#f3c995', '#b0b0b0'],  // A gradient from dark earthy tones to light warm beige
  "Asia": ['#8c3232', '#b74c4c', '#d17878', '#f1a1a1', '#b0b0b0'],    // From dark red-brown to light pink
  "Europe": ['#3d5b58', '#6c9d8d', '#86b8b0', '#98cfc6', '#b0b0b0'],  // From deep greenish-blue to light teal
  "North America": ['#4b3c5c', '#6e517a', '#867b99', '#a2a0b5', '#b0b0b0'], // A transition from deep purple to light lavender
  "South America": ['#6e4e4e', '#8f6e6e', '#9f7f7f', '#d0a0a0', '#b0b0b0'] // From deep mauve to a soft pinkish hue
};


let continents = [
  "North America", // Mexico
  "North America", // United States of America
  "South America", // Argentina
  "Europe",        // United Kingdom
  "Europe",        // Russian Federation
  "Europe",        // Ukraine
  "Europe",        // France
  "Asia",   // Turkey
  "Asia",          // State of Palestine
  "Africa",        // Egypt
  "Asia",          // Iran (Islamic Republic of)
  "Asia",          // Azerbaijan
  "Africa",        // Nigeria
  "Asia",          // Republic of Korea
  "Asia",          // China
  "Asia",          // India
  "Asia",          // Thailand
  "Asia"           // Indonesia
];


let countries = [
  "Mexico", "United States", "Argentina", "Britain", "Russia", "Ukraine",
  "France", "Turkey", "Palestine Ter.", "Egypt", "Iran", "Azerbaijan",
  "Nigeria", "South Korea", "China", "India", "Thailand", "Indonesia"
];
let populations = [
  128, 332, 46, 68, 146, 41, 65, 85, 5, 104, 85, 10, 223, 52, 1439, 1429, 70, 276
];
let heights = [572, 115, 650, 332, 498, 200, 637, 455, 157, 619, 301, 443, 580, 400, 676, 222, 314, 651];

// Map population to size (50 to 250) non-linearly using logarithmic scaling
let sizes = [];
let maritalStatuses = ["Married", "Divorced", "Widowed", "Other"];
let ageGroups = ['[15-19]', '[20-24]', '[25-29]', '[30-34]', '[35-39]', 
                 '[40-44]', '[45-49]', '[50-54]', '[55-59]', '[60-64]', '[65+]'];
let maxRate = 0; // This will be calculated dynamically
let pyramidWidth = 250; // Width of a single pyramid
let pyramidHeight = 400; // Height of a single pyramid
let horizontalSpacing = 300; // Spacing between pyramids horizontally
let verticalSpacing = 500; // Spacing between countries vertically



const hands = 
"                                                                                                                                                       -::::::::::------+#####%%%%%%%%%%@                                               \n" +
"                                                                                                                                                      --:::::::::-------*######%%%%%%%%%                                                \n" +
"                                                                                                                                                      -::::::::::------=########%%%%%#%                                                 \n" +
"                                                                                                                                                     =-:::::::::-------+##########%%#%#                                                 \n" +
"                                                                                                                                                     -::::::::::------=#######%#####%                                                   \n" +
"                                                                                                                                                     :::...:::::-----=*############%                                                    \n" +
"                                                                                                                                                    -::....::::------+############%                                                     \n" +
"                                                                                                                                                   -:.....::::-==--=+############%                                                      \n" +
"                                                                                                                                                  -:.....::::--=--=+###########%*                                                       \n" +
"                                                                                                                                                 --:...:::::------=###########%                                                         \n" +
"                                                                                                                                                 -:.....:::------=###########%                                                          \n" +
"                                                                                                                                                -:.....::::--:-+**##########%                                                           \n" +
"                                                                                                                                               =::...:::::::=+****#########*                                                            \n" +
"                                                                                                                                              -::...::::::-==+++*########%                                                              \n" +
"                                                                                                                                             -.....::::::-===++*###%%###%                                                               \n" +
"                                                                                                                                            -:....::::::--===+##########                                                                \n" +
"                                                                                                                                           -:....::::::---=+*#########*                                                                 \n" +
"                                                                                                                                          -:....:::.:-=--=+*###%%%%#%                                                                   \n" +
"                                                                                                                                         :....:::::-----==+########%                                                                   \n" +
"                                                                                                                                        :....::::--==-===+*########                                                                    \n" +
"                                                                                                                                      :::::::::-:-=-::---*########                                                                    \n" +
"                                                                                                                                 ::::::::--:::::--::::--+*#%%####                                                                       \n" +
"                                                                                                                             ::::::::::------:::::::::-=*#%%%%##                                                                        \n" +
"                                                                                                                        ..::::::::::-----==---:::::---=+**%%%#                                                                         \n" +
"                                                                                                                     ...::::::------=++++**+=-::-----=+*#%%%##                                                                         \n" +
"                                                                                                                   :.:::-::----===+++***###++---------=*%%%%%                                                                          \n" +
"                                                                                                                 :::::--+==+==++****########=------:--=*#%%%                                                                           \n" +
"                                                                                                               ::::-=*##%#*+++**###########*----:::--=+*#%%%%                                                                           \n" +
"                                                                                                            ::::--+*#%%%@@%*###############*-::::---==+*#%%%%                                                                           \n" +
"                                                                                                         ::::--=+#%%%%%@@%%##%%%%%%%%%%#%##*-:-------=+*#%%%%                                                                           \n" +
"                                                                                                      :::::--=*#%%%%%%    %#*+#%%%##%#%##**=::---::--=+*%%%%+                                                                           \n" +
"                                                                                                    -::-=++*###%%%#%       ##*#########***+:-----:---=+#%%%%                                                                            \n" +
"                                                                                                    -=+**##%%%##%#         ###*****###***=:--::::::--=*#%%%%                                                                            \n" +
"                                                                                                      #%#####%#            ########+++++--:::::-----=+#%%%%                                                                             \n" +
"                                                                                                         :.=              +######--:::::::::::::---=+#%%%%                                                                              \n" +
"                                                                                                                           ******=------:::::::::::::-+#%%                                                                               \n" +
"                                                                                                                           *****=:::--:::::::::::::-=*#%%%                                                                               \n" +
"                                                                                                                           *****::---::::::::::---=+*#%%%                                                                                \n" +
"                                                                                                                           **###*-=--:::::-::--=+*--:-*%%                                                                                 \n" +
"                                                                                                                          +**###%%*------+---=***:::-=#%                                                                                  \n" +
"                                                                                                                          =**+-=#%@@=::-+*#:::+##:::-=#%                                                                                   \n" +
"                                                                                                                        =:::-=*#@-:::-+%-::-=*-::--*%@                                                                                   \n" +
"                                                                                                                        -:::--*#%+:::-=*-::--+-::-=#%@                                                                                    \n" +
"                                                                                                                      ::::--+#%*::--=*=:::-=-::-+#%%                                                                                    \n" +
"                                                                                                                     ::::--*##@-:::-++::--:---+*%%#                                                                                     \n" +
"                                                                                                                   --:::--+#%+:::--=:::-=::-+#%#%                                                                                       \n" +
"                                                                                                                    ::--=*#%-::---::--=+%-=*%%                                                                                        \n" +
"                                                                                                                   -::-=*#%-::--::-=+*#%%%#                                                                                              \n" +
"                                                                                                                   -:-=*#=:---=::-=*%%%%                                                                                                  \n" +
"                                                                                                                  +#%*-::--+#==*#%%                                                                                                     \n" +
"                                                                                                                     -:-=*%@%                                                                                                      \n" +
"                                                                                                                        +#%%                                                                                                          \n" +";"

const hands1 = 
"                                                                                                         :.=                                                                                           \n" +
"                                                                                                       ..--+                                                                                         \n" +
"                                                                                                    ::::-=*#                                                                                          \n" +
"                                                                                                   ..:-+*#    -::.:=                                                                                    \n" +
"                                                                                                 :.:-=+*=:::::::-=+*                                                                                    \n" +
"                                                                                               :..:-++:..::--=+***#                                                                                       \n" +
"                                                                                              :::-::..:--=+***#                                                                                       \n" +
"                                                                                              :-::::--==++*      -::-                                                                                    \n" +
"                                                                                             -:::--==++=---::::::--+#=                                                                                 \n" +
"                                                                                             ::::-=++-:..::---=++***                                                                                   \n" +
"                                                                                            -.::--:::::--=++***%*                                                                                      \n" +
"                                                                                            :::-:::--=+++*=-+*#@* --                                                                                    \n" +
"                                                                                           :::-::-=+**+=--::-::-==-:                                                                                     \n" +
"                                                                                          ::::::-=+*+-:::---=++**                                                                                            \n" +
"                                                                                         :::.::-==:::--==+***#*                                                                                                 \n" +
"                                                                                        :::.::-=-:-==+***#%%%                                                                                                       \n" +
"                                                                                        ::.::-=::-=*#**%%%#%                                                                                                                \n" +
"                                                                                       -:::---:-=+**#%@%%###                                                                                                                      \n" +
"                                                                                       ::-:..:--+**%@%@@%%%                                                                                                                           \n" +
"                                                                                       :::::---+*#%%%%%%@%%                                                                                                                           \n" +
"                                                                                      -::::--=+*##%%%%%%%%%                                                                                                                           \n" +
"                                                                                      ::::-=+*###%%%%%%%%%                                                                                                                            \n" +
"                                                                                      ::::-==+*##@@%@%%%%                                                                                                                             \n" +
"                                                                                     ::::---=+###@@%%%%#%                                                                                                                             \n" +
"                                                                                     ::::---=*###@%%%%#%                                                                                                                              \n" +
"                                                                                    ::::---=+####@%%%##                                                                                                                               \n" +
"                                                                                    ::::---=*####%%%##                                                                                                                                \n" +
"                                                                                    :::---=*#####%%##                                                                                                                                 \n" +
"                                                                                   ::::-==*#######%                                                                                                                                  \n" +
"                                                                                  ::::--==+#######                                                                                                                                   \n" +
"                                                                                  ::.:-=+*#######                                                                                                                                     \n" +
"                                                                                 :..:-=***######                                                                                                                                      \n" +
"                                                                                :..:-+**#######                                                                                                                                       \n" +
"                                                                                :::-+*########                                                                                                                                       \n" +
"                                                                               -:::=**#######                                                                                                                                        \n" +
"                                                                               :::-=**#######                                                                                                                                        \n" +
"                                                                              -:::-+***######                                                                                                                                        \n" +
"                                                                              :::--+**######                                                                                                                                         \n" +
"                                                                             -:::-=+***#####                                                                                                                                         \n" +
"                                                                             ::::-=+**#####%                                                                                                                                         \n" +
"                                                                            -:::--=+**######                                                                                                                                         \n" +
"                                                                            ::::-==+**#####                                                                                                                                          \n" +
"                                                                           ::::--=++*#####%                                                                                                                                          \n" +
"                                                                          -::::-==+**######                                                                                                                                          \n" +
"                                                                          ::::--=+**#######                                                                                                                                          \n" +
"                                                                         -:::---=+*#######                                                                                                                                           \n" +
"                                                                        -:::---=+*#######%                                                                                                                                           \n" +
"                                                                       =:::----=+*####%%##                                                                                                                                           \n" +
"                                                                       -:::---=+*###%%%#%%                                                                                                                                           \n" +
"                                                                      -:::---==+*###%%%%%*                                                                                                                                           \n" +
"                                                                     --:::--==+*###%%%%%%                                                                                                                                            \n" +
"                                                                     --:----=+*##%%%%%%%%                                                                                                                                            \n";




// BAR GRAPH DATA
let barData = [169.4, 375.3, 194.9,277.9, 29.6, 79.4, 38.4, 89.0]; // Heights of the bars
let barLabels = ["Heart Disease", "", "Cancer", "", "Alzheimer's", "", "Stroke", ""]; // Labels for the bars

function preload(){
	josefin = loadFont('JosefinSans-Medium.ttf');
	marriageData = loadTable('MarriageData - Sheet1-2.csv', 'csv', 'header');
	table = loadTable('marital_status_rates_by_country_and_sex.csv', 'csv', 'header'); 
}

function setup() {
  canvasHeight = windowHeight - canvasTopMargin - canvasBottomMargin;
  canvasWidth = canvasHeight * 10 / 7;
  ratio = canvasWidth / 1000;
  createCanvas(canvasWidth, canvasHeight);
	textFont(josefin);
  frameRate(60);
  scrollbarHeight = 80 * ratio;
  scrollbarWidth = 20 * ratio;
	currentHeights = Array(barData.length).fill(0);
	
	// Bar graph dimensions
  let graphWidth = canvasWidth - 300; // Width of the bar graph
  let barWidth = graphWidth / barData.length; // Width of each bar

  // Create sliders for even-numbered bars
  for (let i = 1; i < barData.length; i += 2) {
    let sliderX = 0.5 * (windowWidth - canvasWidth) + 150 + (i + 0.05) * barWidth; // Align slider to the bar
    let sliderY = 1350; // Place slider directly below the bar graph
    let slider = createSlider(0, 400, 50);
    slider.position(sliderX, sliderY);
    slider.style("width", `${barWidth * 0.7}px`); // Match bar width
		slider.style(`
			-webkit-appearance: none;
			appearance: none;
			height: 2px; /* Thin track */
			background: #d3d3d3; /* Light grey */
			border-radius: 1px; /* Rounded edges */
			outline: none; /* Remove outline */
		`);

    // Set custom style for the track
		
    slider.hide(); // Hide initially
    sliders.push(slider);
  }
	
	// Button to check the sliders
checkButton = createButton("CHECK YOUR ESTIMATES");

// Style the button
checkButton.style("font-size", "30px");
checkButton.style("padding", "10px 20px");
checkButton.style("background-color", "#d17878");
checkButton.style("color", "white");
checkButton.style("border", "none");
checkButton.style("border-radius", "5px");
checkButton.style("cursor", "pointer");

// Position the button on the canvas
checkButton.position(canvasWidth * 0.95, canvasHeight * 0.1);

// Attach the click event to the "checkSliders" function
checkButton.mousePressed(checkSliders);
	checkButton.hide();
	console.log('Marriage Rates Column:', marriageData.getColumn('MarriageRate'));

	// Compute sizes non-linearly using logarithmic scaling
  let minLog = Math.log10(Math.min(...populations));
  let maxLog = Math.log10(Math.max(...populations));

  for (let pop of populations) {
    let scaledLog = Math.log10(pop);
    let size = map(scaledLog, minLog, maxLog, 50, 250); // p5.js map function
    sizes.push(size);
  }
	// Flowers 
	const rates = marriageData.getColumn('MarriageRate')
  .map((rate) => rate ? parseFloat(rate.trim()) : NaN) // Convert to numbers
  .filter((rate) => !isNaN(rate) && rate >= 0 && rate <= 100); // Ensure valid range

// Convert to numbers
 // Replace with your column name
  const countries = marriageData.getColumn('Country'); // Optional: Get country names
   // Define your color scheme

  for (let i = 0; i < rates.length; i++) {
    let x = map(i, 0, rates.length - 1, 50, canvasWidth - 50); // Fixed intervals
    let stemHeight = heights[i]; // Random stem height
    let color = continentColors[continents[i]];//flowerColors[i % flowerColors.length]; // Cycle through color scheme
    let arcLength = map(rates[i], 0, 100, 0, TWO_PI); // Map marriage rate to 0–360° in radians
    let size = sizes[i]; // Random size for flower
		let country = countries[i];
		let marriageRate = rates[i];
    let flower = new Flower(x, canvasHeight, stemHeight, color, arcLength, size, country, marriageRate);

  // Print the flower's attributes
  flower.printAttributes();

  // Add the flower to the flowers array
  flowers.push(flower);
  }
	
	allCountryData = countries.map((country) => {
    let data = filterCountryData(table, country);
    return {
      country: country,
      data: data,
    };
  });

  // Calculate the max rate dynamically
  calculateMaxRate(allCountryData);
	
	// line graph
	
	 // Parse data
	let categories = ["Great Deal", "Some", "A Little", "Not At All", "N/A"];
 for (let i = 0; i < categories.length; i++) {
    let button = createButton(categories[i]);
    button.position(20, 50 + i * 40); // Adjust position for spacing
    button.style("background-color", "#0066cc"); // Initial background color
    button.style("color", "white"); // Text color
    button.style("border", "none"); // Remove border
    button.style("padding", "10px 20px"); // Add padding
    button.style("font-size", "16px"); // Font size
    button.style("font-family", "Arial, sans-serif"); // Font style
    button.style("border-radius", "5px"); // Rounded corners
    button.style("cursor", "pointer"); // Pointer cursor for interactivity
    button.mousePressed(() => toggleCategory(i, button)); // Attach click handler
    buttons.push(button);
  }
}

function mouseWheel(event) {
  // Adjust scrollY based on the mouse wheel movement
  scrollY += event.delta * ratio;
  scrollY = constrain(scrollY, 0, maxScroll); // Keep within bounds
}

function checkSliders() {
  userSelections = sliders.map(slider => slider.value()); // Save slider values
  showComparison = true; // Enable comparison mode
}


function mousePressed() {
  if (
    mouseX > width - scrollbarWidth &&
    mouseY > scrollbarY &&
    mouseY < scrollbarY + scrollbarHeight
  ) {
    draggingScrollbar = true;
    lastMouseY = mouseY; // Record the starting position of the mouse
  }
}

function mouseDragged() {
  if (draggingScrollbar) {
    let deltaY = mouseY - lastMouseY; // Change in mouse Y position
    let scrollDelta = (deltaY / (height - scrollbarHeight)) * maxScroll; // Proportional scroll change
    scrollY = constrain(scrollY + scrollDelta, 0, maxScroll); // Update scrollY
    lastMouseY = mouseY; // Update lastMouseY for the next frame
  }
}

function mouseReleased() {
  draggingScrollbar = false; // Stop dragging
}


let disadvantagedData = [
  { name: "Mexico", proportions: [21, 26, 22, 26, 5], continent: "North America" },
  { name: "United States", proportions: [9, 28, 20, 38, 5], continent: "North America" },
  { name: "Russia", proportions: [9, 18, 11, 47, 15], continent: "Europe" },
  { name: "Argentina", proportions: [7, 17, 18, 47, 11], continent: "South America" },
  { name: "Britain", proportions: [12, 32, 16, 31, 9], continent: "Europe" },
  { name: "Ukraine", proportions: [7, 15, 10, 53, 15], continent: "Europe" },
  { name: "France", proportions: [6, 11, 30, 41, 12], continent: "Europe" },
  { name: "Turkey", proportions: [52, 18, 12, 16, 2], continent: "Asia" },
  { name: "Palestine Ter.", proportions: [17, 44, 25, 12, 2], continent: "Asia" },
  { name: "Egypt", proportions: [21, 27, 21, 31, 0], continent: "Africa" },
  { name: "Iran", proportions: [14, 28, 21, 25, 12], continent: "Asia" },
  { name: "Azerbaijan", proportions: [14, 26, 19, 36, 5], continent: "Asia" },
  { name: "Nigeria", proportions: [25, 33, 23, 16, 3], continent: "Africa" },
  { name: "South Korea", proportions: [30, 51, 16, 2, 1], continent: "Asia" },
  { name: "China", proportions: [5, 49, 30, 13, 3], continent: "Asia" },
  { name: "India", proportions: [18, 24, 24, 11, 23], continent: "Asia" },
  { name: "Thailand", proportions: [7, 22, 20, 30, 21], continent: "Asia" },
  { name: "Indonesia", proportions: [8, 12, 22, 54, 4], continent: "Asia" },
];

// Colors for the categories
let categoryColors = [
  "#FF0000", // Great_Deal - Red
  "#0000FF", // Some - Blue
  "#00FF00", // A_Little - Green
  "#FFFF00", // Not_At_All - Yellow
  "#808080", // N/A - Grey
];

let rowHeight = 200; // Height of each country's section
let dotSize = 15; // Diameter of each dot
let spacing = 5; // Spacing between dots

function drawDotsForCountry(countryIndex, xStart, yStart) {
  let country = disadvantagedData[countryIndex];
  let dotIndex = 0;

  // Loop through each proportion category
  for (let i = 0; i < country.proportions.length; i++) {
    for (let j = 0; j < country.proportions[i]; j++) {
      let x = xStart + (dotIndex % 50) * (dotSize + spacing); // Position in row
      let y = yStart + Math.floor(dotIndex / 50) * (dotSize + spacing); // Position in column

      // Draw only dots that are visible on the screen
      if (y > -dotSize && y < canvasHeight + dotSize) {
        fill(categoryColors[i]);
        noStroke();
        ellipse(x, y, dotSize, dotSize);
      }

      dotIndex++;
    }
  }

  // Draw the country name above the dots
  if (yStart - scrollY > -rowHeight && yStart - scrollY < canvasHeight + rowHeight) {
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text(country.name, xStart + 25 * (dotSize + spacing), yStart - 30);
  }
}


function drawDisadvantagedData() {
  for (let i = 0; i < disadvantagedData.length; i++) {
    let yStart = i * rowHeight - scrollY;
    if (yStart > -rowHeight && yStart < height + rowHeight) {
      // Only draw visible rows
      drawDotsForCountry(i, 50, yStart + 100);
    }
  }
}


function draw() {
  background(40); // Black background
	fill(0);
	rect(0, 0, canvasWidth, canvasHeight);
  drawScrollbar();
  drawContent();
	
	if (scrollY > 14500 && scrollY < 15000) {
   
		if (showComparison) {
  sliders.forEach(slider => slider.hide()); // Hide sliders during comparison
			checkButton.hide();
			 drawScrollbar();
} else {
  sliders.forEach(slider => slider.show()); // Show sliders during normal mode
	checkButton.show();
	 drawScrollbar();
}
  } else {
    // Hide sliders outside the graph range
    sliders.forEach((slider) => slider.hide());
		checkButton.hide();
		 drawScrollbar();
  }
	

    buttons.forEach(button => button.style('display', 'none'));
  
	
	

}

function drawScrollbar() {
  push();
  fill(100);
  scrollbarY = map(scrollY, 0, maxScroll, 0, height - scrollbarHeight);
  rect(width - scrollbarWidth, scrollbarY, scrollbarWidth, scrollbarHeight);
  pop();
}

function drawContent() {
  textAlign(LEFT, CENTER);
  fill(255); // White text
  textSize(60 * ratio);
	textStyle(BOLD);
  textFont(josefin);

  if (scrollY < 500) {
    // Map scroll position for timings
		
let scrollThreshold1 = 0; // Point where "TILL DEATH DO US" fully appears
let scrollThreshold2 = 400; // Point where "PART" starts to appear

let alpha1 = map(scrollY, 0, scrollThreshold1, 0, 255); // Fade in "TILL DEATH DO US"
let alpha2 = map(scrollY, scrollThreshold1, scrollThreshold2, 0, 255); // Fade in "PART"
			textSize(15);

// Ensure alpha values are within valid range
//alpha1 = constrain(alpha1, 0, 255);
//alpha2 = constrain(alpha2, 0, 255);

//let scrollThreshold3 = 800; // Point where "hands1" starts to drift
//let maxDriftY = height; // Maximum vertical drift (off-screen)
//let maxDriftX = -width / 2; // Maximum horizontal drift (curving left)

// Calculate progress as a normalized value between 0 and 1
//let progress = map(scrollY, scrollThreshold2, scrollThreshold3, 0, 1);
//progress = constrain(progress, 0, 1);

// Use easing for curved movement
//let driftX = lerp(0, maxDriftX, progress * (2 - progress)); // Quadratic easing for leftward drift
//let driftY = lerp(0, maxDriftY, progress); // Linear easing for downward drift


// Render "TILL DEATH DO US"
fill(255, 255, 255, alpha1);
textFont(josefin);
textSize(60 * ratio);
text("TILL DEATH \nDO US ", width / 12, height / 6);

// Render "PART" later
fill(255, 255, 255, alpha2);
textFont(josefin);
textSize(60 * ratio);
text("PART", 9 * width / 12, 5 * height / 6);

// Render the drifting "hands1"
textSize(15);
textFont("Courier");
fill(255); // Ensure it's visible
//text(hands1, driftX, 7 * height / 9 + driftY); // Apply the diagonal drift

// Render the static "hands"
//text(hands, 0, height / 3);
		
  } else if (scrollY >= 500 && scrollY < 1000) {
    // New Screen 1: "Every year, more than 42 million marriages occur worldwide."
    let alpha = map(scrollY, 500, 1000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
     textSize(20 * ratio);
		textFont('Courier');
    text("Every year, more than 42 million marriages occur worldwide.", width / 2, height / 2);
  } else if (scrollY >= 1000 && scrollY < 1500) {
    // New Screen 2: "Every minute more than 160 people get married."
    let alpha = map(scrollY, 1000, 1500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
     textSize(20 * ratio);
		textFont('Courier');
    text("Every hour 9600 more wed. Every minute 160. Every second 2.", width / 2, height / 2);
	
  }  else if (scrollY >= 1500 && scrollY < 2000) {
    // New Screen 2: "Every minute more than 160 people get married."
    let alpha = map(scrollY, 1500, 2000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
     textSize(20 * ratio);
		textFont('Courier');
    text("And yet marriages bloom in different ways across the globe.", width / 2, height / 2);
	
  }
	
	
	else if (scrollY >= 2000 && scrollY < 3000){
		let fadeAlpha = map(scrollY,2000, 2500, 0, 255); // Fade in logic
push();
  fill(0, fadeAlpha);
  rect(0, 0, canvasWidth, canvasHeight); // Background for the flower screen
  pop();

  flowers.forEach((flower) => {
    // Update bloom progress based on scroll
    flower.updateBloomProgress(scrollY, 2000, 2500);

    push();
    tint(255, fadeAlpha); // Apply transparency
    flower.display(); // Use the display method from the Flower class
    pop();
  });



// Draw pop-ups after all flowers are rendered
flowers.forEach((flower) => {
  if (flower.isClicked) {
    flower.displayPopup(); // Ensure pop-ups are drawn above everything else
  }
});
		 textSize(35 * ratio);
		textAlign(LEFT, CENTER);
		text("FLOWERING SEASON", width/30, height / 12);
		 textSize(20 * ratio);

		textFont('Courier New');
		text("Click on any flower to see which country it belongs to and \nthe percentage of those aged 15+ who are married there. ", width/30, height / 15 + 130);
		fill(150);
			 textSize(15 * ratio);
				text("Size of each flower corresponds to the approximate \nsize of the country on a logarithmic scale, \nand size of arc corresponds to marriage rate. ", width/30, height / 15 + 300);
 
		drawLegend();
		noStroke();
	}else if (scrollY >= 3000 && scrollY < 3500) {
		noStroke();
    // New Screen 2: "That means, every minute more than 160 people get married."
    let alpha = map(scrollY, 3000, 3500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
      textSize(20 * ratio);
		textFont('Courier New');;
    text("But it's not always so cheery.\n Each continent has its own marriage lifecycles, \nshown through population pyramids.\n \n The purple color is for females, the green-blue for males.", width / 2, height / 2);
	
  } else if (scrollY >= 3500 && scrollY < 4000) {
    // New Screen 2: "That means, every minute more than 160 people get married."
		noStroke();
    let alpha = map(scrollY, 3500, 4000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("In North America, we see low marriage rates, \nhigh divorce rates, and average widow rates.", width / 2, height / 2);
	
  } 
	else if (scrollY >= 4000 && scrollY < 4500) {
		 let alpha = map(scrollY, 4000, 4500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
			noStroke();
		
		
		
  let selectedCountry = "United States"; // Replace with the desired country name
fill(0);
  rect(0, 0, canvasWidth, canvasHeight); // Background for pyramids

		let quarterWidth = canvasWidth / 4;

  // Fetch data for the selected country
  let countryData = filterCountryData(table, selectedCountry);
	//drawPyramid(countryData, "Married", 400, 400, pyramidWidth, pyramidHeight, selectedCountry);


		drawPyramids(countryData, 550, pyramidWidth, pyramidHeight, horizontalSpacing);
		 textSize(30 * ratio);
		textAlign(LEFT, CENTER);
		textFont(josefin);
		text("UNITED STATES POPULATION PYRAMIDS", width/13, height / 5);
		 textSize(20 * ratio);

    } else if (scrollY >= 4500 && scrollY < 5000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 4500, 5000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("In Asia, we see much lower rates of divorce, but \nhigher rates of widowed individuals, especially women. \nThere are also fewer single people.", width / 2, height / 2);
	

    } else if (scrollY >= 5000 && scrollY < 5500) {
			noStroke();
		
  let selectedCountry = "India"; // Replace with the desired country name
fill(0);
  rect(0, 0, canvasWidth, canvasHeight); // Background for pyramids

		let quarterWidth = canvasWidth / 4;

  // Fetch data for the selected country
  let countryData = filterCountryData(table, selectedCountry);
	//drawPyramid(countryData, "Married", 400, 400, pyramidWidth, pyramidHeight, selectedCountry);


		drawPyramids(countryData, 550, pyramidWidth, pyramidHeight, horizontalSpacing);
			 textSize(30 * ratio);
		textAlign(LEFT, CENTER);
			textFont(josefin);
		text("INDIA POPULATION PYRAMIDS", width/13, height / 5);
		 textSize(20 * ratio);

    }
	
	else if (scrollY >= 5500 && scrollY < 6000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 3250, 3500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("Other countries, like Nigeria, believe in marriage starting at a young age, \nwith most of its adult population married between 15 and 19. \nHere we see more people widowed than single \nand a rectangular first column.", width / 2, height / 2);
	

    } else if (scrollY >= 6000 && scrollY < 6500) {
			noStroke();
		
  let selectedCountry = "Nigeria"; // Replace with the desired country name
fill(0);
  rect(0, 0, canvasWidth, canvasHeight); // Background for pyramids

		let quarterWidth = canvasWidth / 4;

  // Fetch data for the selected country
  let countryData = filterCountryData(table, selectedCountry);
	//drawPyramid(countryData, "Married", 400, 400, pyramidWidth, pyramidHeight, selectedCountry);


		drawPyramids(countryData, 550, pyramidWidth, pyramidHeight, horizontalSpacing);
			
			 textSize(30 * ratio);
		textAlign(LEFT, CENTER);
			textFont(josefin);
		text("NIGERIA POPULATION PYRAMIDS", width/13, height / 5);
		 textSize(15 * ratio);
			textFont('Courier New');

    } else if (scrollY >= 6500 && scrollY < 7000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 6500, 7000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("Let's dive a bit deeper into the widowed population.", width / 2, height / 2);
	

    } else if (scrollY >= 7000 && scrollY < 7500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 7000, 7500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("Widows play a distinct role in society.", width / 2, height / 2);
	

    } else if (scrollY >= 7500 && scrollY < 8000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 7500, 8000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("In some cultures, like Europe in the olden days, widows were \nthe most powerful women in society, as they \nwere the only women with decision-making power. \nTypically only men had power but \of course their husbands were dead. ", width / 2, height / 2);
	

    } else if (scrollY >= 8000 && scrollY < 8500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 8000, 9000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("But in other cultures, widows were seen as the weakest links, \nsuch as in Hinduism where they were burned alive\n alongside their husbands. ", width / 2, height / 2);
	

    } else if (scrollY >= 8500 && scrollY < 9000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 8000, 9000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("Where do other countries fall? ", width / 2, height / 2);
	

    } 
	
	else if (scrollY >= 9000 && scrollY < 9500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 9000, 9500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("And why should we care? ", width / 2, height / 2);
	

    } 	else if (scrollY >= 9500 && scrollY < 10000) {
			noStroke();
		
    background(0);

			textSize(15 * ratio);
			 textAlign(LEFT, CENTER);

		textFont('Courier New');
	text("How disadvantaged do female widows feel compared  to the rest of society in different continents?\nHere are the results with darker colors being more disadvantaged. ", width/30, height / 15 + 30);
  }
	
	
	else if (scrollY >= 10000 && scrollY < 10500) {
			noStroke();
		
    background(0);
activeCategories = [true, false, false, false, false]; 
    // Define grid for pie charts
    let cols = 6;
    let rows = Math.ceil(disadvantagedData.length / cols);
    let cellWidth = width / cols;
    let cellHeight = (height - 100) / rows;
    let radius = min(cellWidth, cellHeight) * 0.4;

    disadvantagedData.forEach((country, index) => {
      let col = index % cols;
      let row = Math.floor(index / cols);
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2 + 100; // Offset for checkboxes

      drawCountryArc(x, y, radius, country);
    });
			
			textSize(15 * ratio);
			 textAlign(LEFT, CENTER);

		textFont('Courier New');
		text("This is the portion of respondents who said widows were treated A Great Deal worse than others. ", width/30, height / 15 + 30);
  } else if (scrollY >= 10500 && scrollY < 11000) {
			noStroke();
		
    background(0);
activeCategories = [true, true, false, false, false]; 
    // Define grid for pie charts
    let cols = 6;
    let rows = Math.ceil(disadvantagedData.length / cols);
    let cellWidth = width / cols;
    let cellHeight = (height - 100) / rows;
    let radius = min(cellWidth, cellHeight) * 0.4;

    disadvantagedData.forEach((country, index) => {
      let col = index % cols;
      let row = Math.floor(index / cols);
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2 + 100; // Offset for checkboxes

      drawCountryArc(x, y, radius, country);
    });
			
			textSize(15 * ratio);
			 textAlign(LEFT, CENTER);

		textFont('Courier New');
		text("Let's add in those who consider widows somewhat disadvantaged. ", width/30, height / 15 + 30);
  } else if (scrollY >= 11000 && scrollY < 11500) {
			noStroke();
		
    background(0);
activeCategories = [true, true, true, false, false]; 
    // Define grid for pie charts
    let cols = 6;
    let rows = Math.ceil(disadvantagedData.length / cols);
    let cellWidth = width / cols;
    let cellHeight = (height - 100) / rows;
    let radius = min(cellWidth, cellHeight) * 0.4;

    disadvantagedData.forEach((country, index) => {
      let col = index % cols;
      let row = Math.floor(index / cols);
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2 + 100; // Offset for checkboxes

      drawCountryArc(x, y, radius, country);
    });
			
			textSize(15 * ratio);
			 textAlign(LEFT, CENTER);

		textFont('Courier New');
		text("Now, we add in those who consider widows a little disadvantaged.\nOn average 63% of respondents thinks widows are treated worse than the average population. ", width/30, height / 15 + 30);
  } else if (scrollY >= 11500 && scrollY < 12000) {
			noStroke();
		
    background(0);
activeCategories = [true, true, true, true, true]; 
    // Define grid for pie charts
    let cols = 6;
    let rows = Math.ceil(disadvantagedData.length / cols);
    let cellWidth = width / cols;
    let cellHeight = (height - 100) / rows;
    let radius = min(cellWidth, cellHeight) * 0.4;

    disadvantagedData.forEach((country, index) => {
      let col = index % cols;
      let row = Math.floor(index / cols);
      let x = col * cellWidth + cellWidth / 2;
      let y = row * cellHeight + cellHeight / 2 + 100; // Offset for checkboxes

      drawCountryArc(x, y, radius, country);
    });
			
			textSize(15 * ratio);
			 textAlign(LEFT, CENTER);

		textFont('Courier New');
		text("These last categories are those who think widows aren't disadvantaged at all \nor who did not respond to this question. ", width/30, height / 15 );
  } else if (scrollY >= 12000 && scrollY < 12500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 9000, 9500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("We see that Asian and African countries have higher perceived disadvantage\n for widows, but American countries also do. ", width / 2, height / 2);
	

    } 
   	else if (scrollY >= 12500 && scrollY < 13000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 9000, 9500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
		textFont('Courier New');
    text("But there are impacts even beyond perception of advantage and connection. ", width / 2, height / 2);
	

    } else if (scrollY >= 13000 && scrollY < 13500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 11000, 11500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("Marital status can have an impact on health because of \nthe emotional toll as well as lack of immediate care. ", width / 2, height / 2);
	

    } else if (scrollY >= 13500 && scrollY < 14000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 11500, 12000, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
    text("But just how impactful is it?", width / 2, height / 2);
	

    } else if (scrollY >= 14000 && scrollY < 14500) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 12000, 12500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(20 * ratio);
			textFont('Courier New');
			
    text("It's time for you to find out. ", width / 2, height / 2);
	

    }
	
	
	

     
		
		
		
		
  



	
  
	
	
	
	else if (scrollY >= 14500 && scrollY < 15000) {
		noStroke();
  // Bar Graph appears later
  let fadeAlpha = map(scrollY, 12000, 13000, 0, 255); // Fade-in effect
  push();
  fill(0, fadeAlpha);
  rect(100, 200, canvasWidth - 200, 900); // Background for the graph
  fill(255, fadeAlpha);
  drawBarGraph(150, 220, canvasWidth - 300, 1050); // Draw the bar graph
		
  pop();
		
		 textSize(35 * ratio);
		textAlign(LEFT, CENTER);
		text("MORTALITY RATES, COMPARED ", width/30, height / 12);
		 textSize(20 * ratio);

		textFont('Courier New');
		text("Use the sliders to estimate the mortality rates for widowed individuals ", width/30, height / 15 + 130);
		textSize(10 * ratio);
		text("240*", width/30 , height/2 - 200);
		text("180*", width/30 , height/2);
		text("120*", width/30 , height/2 + 200);
		text("60*", width/30 , height/2 + 400);
		text("*Deaths per 100,000 individuals", width/30, height*0.9 + 75);
		fill(150);
		if (!showComparison){
			 textSize(15 * ratio);
				text("The solid white bars are the true mortality values for married \nindividuals, but the dashed grey lines are for you to guess. ", width * 0.4, height / 15 + 300);
		}
		else{
			if (score > 100){
				textSize(15 * ratio);
				text("It's a lot worse than you thought... ", width * 0.5, height / 15 + 300);
			}
			else{
				textSize(15 * ratio);
				text("Not bad! Have you done this before?\nIt's pretty depressing, no?", width * 0.5, height / 15 + 300);
			}
			textSize(15 * ratio);
			text("The solid white bars are the true mortality values\nfor married individuals, the dashed are your guess, \nand the red is the true mortality for widowed.", width * 0.5, height / 15 + 450);
		}
			
 
		




} else if (scrollY >= 15000 && scrollY < 16000) {
			noStroke();
		
    noStroke();
    let alpha = map(scrollY, 12000, 12500, 0, 255); // Fade in
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alpha);
    textSize(15 * ratio);
			textFont('Courier');
			text(hands, width/2, height / 3);
		text("Till death do we part.\nLet's come together until then.", width / 4, height * 3/ 4);
	

    }
}


	function toggleCategory(index, button) {
  activeCategories[index] = !activeCategories[index]; // Toggle the state
  if (activeCategories[index]) {
    button.style("background-color", "#0066cc"); // Active state
    button.style("color", "white");
  } else {
    button.style("background-color", "#cccccc"); // Inactive state
    button.style("color", "#333");
  }
  redraw(); // Trigger canvas redraw
}


function drawBarGraph(x, y, width, height) {
  let barWidth = width / barData.length;
  let maxBarHeight = 400;

  for (let i = 0; i < barData.length; i++) {
		score = 0;
    let barHeight;
    let targetHeight;
    let userHeight;

    if (i % 2 === 1) {
      // Even-numbered bars
      if (showComparison) {
        // Get target and user-selected heights
        targetHeight = map(barData[i], 0, maxBarHeight, 0, height);
        userHeight = map(userSelections[(i - 1) / 2], 0, maxBarHeight, 0, height);

        // Animate the red bar to slide up into place
        let animatedHeight = lerp(currentHeights[i] || 0, targetHeight, 0.1);
        currentHeights[i] = animatedHeight; // Update the current height

        fill('#d17878'); // Semi-transparent red
        noStroke();
        rect(
          x + i * barWidth, // X position
          y + height - animatedHeight, // Start at the animated height
          barWidth * 0.8, // Bar width
          animatedHeight // Height of the red bar
        );

        // Draw user-selected diagonal pattern bar
        drawDiagonalPattern(
          x + i * barWidth, // X position
          y + height - userHeight, // Start at user's height
          barWidth * 0.8, // Bar width
          userHeight // Bar height
        );
				score = Math.abs(targetHeight - userHeight) ;
      } else {
        // Normal mode: Use slider value
        sliders[(i - 1) / 2].show();
        barHeight = map(sliders[(i - 1) / 2].value(), 0, maxBarHeight, 0, height);
        currentHeights[i] = barHeight; // Sync current height

        // Draw diagonal pattern for the grey bar
        drawDiagonalPattern(
          x + i * barWidth,
          y + height - barHeight,
          barWidth * 0.8,
          currentHeights[i]
        );
      }
    } else {
      // Odd-numbered bars (static height)
      barHeight = map(barData[i], 0, maxBarHeight, 0, height);
      currentHeights[i] = barHeight; // Static bars remain at true height

      // Draw grey static bar
      noStroke();
      fill(200);
      rect(
        x + i * barWidth,
        y + height - barHeight,
        barWidth * 0.8,
        barHeight
      );
    }

    // Draw the label below the bar
    fill(255);
    textAlign(CENTER, TOP);
    textSize(15 * ratio);
    text(barLabels[i], x + i * barWidth + barWidth * 0.9, y + height + 60);
		totalScore += score;
  }
}


// Function to draw diagonal pattern bar
function drawDiagonalPattern(x, y, barWidth, barHeight) {
  let spacing = 10; // Spacing between diagonal lines
  stroke(255, 255, 255, 150); // Semi-transparent blue for diagonal lines
  strokeWeight(2);
  noFill();

  // Draw diagonal lines fully within the bar's rectangular space
  for (let i = -barHeight; i < barWidth; i += spacing) {
    let startX = x + i;
    let startY = y;
    let endX = x + i + barHeight;
    let endY = y + barHeight;

    // Clip the lines to the top and bottom of the rectangle
    if (startX < x) {
      startY += x - startX; // Adjust the starting Y to clip to the left
      startX = x; // Set X to the left edge
    }
    if (endX > x + barWidth) {
      endY -= endX - (x + barWidth); // Adjust the ending Y to clip to the right
      endX = x + barWidth; // Set X to the right edge
    }

    line(startX, startY, endX, endY);
  }
}

function mousePressed() {
  // Reset all popups
  flowers.forEach((flower) => {
    flower.isClicked = false;
  });

  // Check if any flower was clicked
  flowers.forEach((flower) => {
    flower.handleClick();
  });

  if (
    mouseX > width - scrollbarWidth &&
    mouseY > scrollbarY &&
    mouseY < scrollbarY + scrollbarHeight
  ) {
    draggingScrollbar = true;
    lastMouseY = mouseY;
  }
}



class Flower {
  constructor(x, y, stemHeight, color, arcLength, size, country, marriageRate) {
    this.x = x;
    this.y = y;
    this.country = country;
    this.marriageRate = marriageRate;
    this.stemHeight = stemHeight;
    this.color = color;
    this.arcLength = arcLength; // Total angle spanned by petals
    this.size = size; // Base size of the flower
    this.isClicked = false;
    this.fallingPetals = []; // Array to store falling petals
    this.petalsFalling = false;
    this.bloomProgress = 0; // Track bloom progress (0 = no bloom, 1 = fully bloomed)

    // Precompute attributes for petals
    this.petalCount = int(map(this.arcLength, 0, TWO_PI, 6, 100)); // Petal count proportional to arc length
    this.petalAttributes = [];
    for (let i = 0; i < this.petalCount; i++) {
      let angle = map(i, 0, this.petalCount - 1, 0, this.arcLength);
      this.petalAttributes.push({
        angle: angle,
        midX: random(-5, 5),
        midY: random(-5, 5),
        thickness: random(1, 2),
        length: this.size + random(-5, 5),
        xOffset: 0,
        yOffset: 0,
        falling: false,
        speedX: random(-2, 2), // Horizontal speed for falling
        speedY: random(1, 3),  // Vertical speed for falling
        rotation: random(-PI / 16, PI / 16), // Random rotation
      });
    }
  }

  // Update the bloomProgress based on scroll position
  updateBloomProgress(scrollY, startScroll, endScroll) {
    if (scrollY >= startScroll && scrollY <= endScroll) {
      this.bloomProgress = map(scrollY, startScroll, endScroll, 0, 1); // Progress from 0 to 1
    } else if (scrollY > endScroll) {
      this.bloomProgress = 1; // Fully bloomed if past the section
    } else {
      this.bloomProgress = 0; // Reset if before the section
    }
  }
	startFallingPetals() {
    this.petalsFalling = true;
  }

  updatePetals() {
    if (this.petalsFalling) {
      this.petalAttributes.forEach((petal) => {
        if (!petal.falling) {
          petal.falling = true;
        }
        petal.xOffset += petal.speedX; // Update horizontal position
        petal.yOffset += petal.speedY; // Update vertical position
        petal.rotation += random(-0.01, 0.01); // Add slight rotation
      });
    }
  }
	
	  // Detect if the mouse is over the flower
  checkMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y - this.stemHeight);
    return d < this.size / 2;
  }

  // Toggle popup when clicked
  handleClick() {
    if (this.checkMouseOver()) {
      this.isClicked = !this.isClicked;
			this.isClicked = true;
    }
		
  }

  // Display popup with country and marriage rate
// Adjusted displayPopup function
displayPopup() {
  push(); // Save the current drawing style and transformation state

  // Calculate popup position
  let popupX = this.x + 20; // Default position to the right of the flower
  if (this.x + 240 > canvasWidth) {
    popupX = this.x - 240; // Shift pop-up to the left if near the right edge
  }
  let popupY = this.y - this.stemHeight - 110; // Position above the flower

  // Draw the popup background box
  fill(255, 180); // Semi-transparent white background
  stroke(255, 80); // Light semi-transparent border
  strokeWeight(20); // Thick border for emphasis
  rect(popupX, popupY, 220, 90, 10); // Rounded rectangle with 10px corner radius

  // Set up text styles
  noStroke(); // Remove border for text
  textAlign(LEFT); // Align text to the left

  // Title: Country Name
  textSize(15 * ratio); // Scale text size dynamically
  textStyle(BOLD); // Bold for the title
  fill(0); // Black text color
  text(this.country, popupX + 10, popupY + 25); // Position title at the top

  // Body: Marriage Rate Information
  textSize(12 * ratio); // Smaller text for body
  textStyle(NORMAL); // Normal weight for body text
  fill(0); // Black text color

  if (this.marriageRate === 'NA') {
    text("No data available", popupX + 10, popupY + 60); // Display fallback message
  } else {
    text(`${Math.round(this.marriageRate)}% married`, popupX + 10, popupY + 60); // Display marriage rate
  }

  pop(); // Restore the previous drawing style and transformation state
}



printAttributes() {
  console.log(`
    Flower Attributes:
    ------------------
    Position:        (${this.x}, ${this.y})
    Stem Height:     ${this.stemHeight}
    Color:           ${this.color}
    Arc Length:      ${this.arcLength.toFixed(2)} radians
    Size:            ${this.size}
  `);
}


  display() {
    // Draw the stem
    stroke(this.color);
    strokeWeight(3);
    line(this.x, this.y, this.x, this.y - this.stemHeight);

    // Draw the petals around the top of the stem
    push();
    translate(this.x, this.y - this.stemHeight); // Top of the stem
    stroke(this.color);
    noFill();

    let startAngle = 3 * PI / 2 - this.arcLength / 2; // Start of the arc
    let endAngle = 3 * PI / 2 + this.arcLength / 2;   // End of the arc

   for (let i = 0; i < this.petalCount; i++) {
      let angle = map(i, 0, this.petalCount - 1, startAngle, endAngle);
      let petalLength = this.petalAttributes[i].length; // Use precomputed petal length

      // Calculate bloom position based on bloomProgress
      let bloomFactor = lerp(0, 1, this.bloomProgress); // Use lerp to gradually move petals
      let petalX = petalLength * cos(angle) * bloomFactor;
      let petalY = petalLength * sin(angle) * bloomFactor;

      strokeWeight(this.petalAttributes[i].thickness); // Use precomputed thickness

      // Draw wavy petal
      beginShape();
      vertex(0, 0); // Start at the center
      let midX = (petalLength / 2) * cos(angle) + this.petalAttributes[i].midX;
      let midY = (petalLength / 2) * sin(angle) + this.petalAttributes[i].midY;
      quadraticVertex(midX, midY, petalX, petalY); // Control point creates a curve
      endShape();
    }
    pop();
		if (this.isClicked) {
      this.displayPopup();
    }
  }
}

function calculateMaxRate(allCountryData) {
  // Dynamically calculate the max rate across all countries for proper scaling
  maxRate = 200; // Add 10% buffer
// Add 10% buffer
}

function filterCountryData(table, country) {
  let filteredData = [];
  for (let i = 0; i < table.getRowCount(); i++) {
    if (table.getString(i, "Country or area") === country) {
      let ageGroup = table.getString(i, "AgeGroup");
      let sex = table.getString(i, "Sex");

      // Normalize sex values
      if (sex === "Men") sex = "Male";
      if (sex === "Women") sex = "Female";

      maritalStatuses.forEach(status => {
        let rate = parseFloat(table.getString(i, status));
        if (!isNaN(rate)) { // Ensure valid rates
          filteredData.push({
            ageGroup: ageGroup,
            sex: sex,
            maritalStatus: status,
            rate: rate
          });
        }
      });
    }
  }
  return filteredData;
}
function drawPyramid(countryData, maritalStatus, x, y, pyramidWidth, pyramidHeight, country) {
	noStroke();
  let pyramidToScaleGap = 50; // Space between pyramid and scale
  let barHeight = pyramidHeight / ageGroups.length; // Bar height for each age group

  // Draw marital status title
  noStroke();
  fill(255);
  textSize(20 * ratio);
  textAlign(CENTER, CENTER);
  text(maritalStatus, x + pyramidWidth / 2, y - 45);

  // Draw country title (only once per row)
  if (maritalStatus === maritalStatuses[0]) {
    textSize(16);
    textAlign(CENTER, CENTER);
    text(country, x + pyramidWidth / 2, y - 50);
  }

  // Filter data for the current marital status
  let maritalData = countryData.filter((d) => d.maritalStatus === maritalStatus);

  // Calculate the scale factor
  let scaleFactor = pyramidWidth / 200; // Pyramid width corresponds to a scale of 200 (100 per side)

  // Draw each age group
  for (let j = 0; j < ageGroups.length; j++) {
    let ageGroup = ageGroups[j];
    let yPos = y + j * barHeight;

    // Draw age group label (only for the first pyramid)
    if (maritalStatus === maritalStatuses[0]) {
      fill(255);
      textSize(15 * ratio);
      textAlign(RIGHT, CENTER);
      text(ageGroup, x - 20, yPos + barHeight / 2);
    }

    // Get male and female rates for this age group
    let maleRate = maritalData.find((d) => d.ageGroup === ageGroup && d.sex === "Male")?.rate || 0;
    let femaleRate = maritalData.find((d) => d.ageGroup === ageGroup && d.sex === "Female")?.rate || 0;

    // Draw male bar (left side)
    fill('#ccdfdc');
    rect(
      x + pyramidWidth / 2 - maleRate * scaleFactor, // Scale based on 200
      yPos,
      maleRate * scaleFactor,
      barHeight - 2
    );

    // Draw female bar (right side)
    fill('#867b99');
    rect(
      x + pyramidWidth / 2,
      yPos,
      femaleRate * scaleFactor,
      barHeight - 2
    );
  }

  // Draw central axis
  stroke(255);
  line(x + pyramidWidth / 2, y, x + pyramidWidth / 2, y + pyramidHeight);

  // Draw scale below the pyramid
  let scaleY = y + pyramidHeight + pyramidToScaleGap;
  drawScale(x, scaleY, pyramidWidth);
}

function drawScale(x, y, pyramidWidth) {
	noStroke();
  let tickCount = 2; // Number of ticks per side
  let tickInterval = 100 / tickCount; // Interval for tick marks
  let tickSpacing = pyramidWidth / 10; // Spacing for each tick (200 / 10)
	textSize(10 * ratio);

  // Draw ticks for the male side (left)
  stroke(255);
  for (let i = 0; i <= 1; i++) {
    let tickX = x + pyramidWidth / 2 - 5 * tickSpacing;
    line(tickX, y, tickX, y + 0); // Tick mark
    noStroke();
    fill(255);
    textAlign(CENTER, TOP);
    text(100, tickX, y + 12);
  }

  // Draw ticks for the female side (right)
  stroke(255);
  for (let i = 0; i <= 1; i++) {
    let tickX = x + pyramidWidth / 2 + 5 * tickSpacing;
    line(tickX, y, tickX, y + 10); // Tick mark
    noStroke();
    fill(255);
    textAlign(CENTER, TOP);
    text(100, tickX, y + 12);
  }

  // Draw baseline
  stroke(255);
  line(x, y, x + pyramidWidth, y); // Baseline
}

function drawPyramids(countryData, yStart, pyramidWidth, pyramidHeight, horizontalSpacing) {
  let x = 450; // Initial horizontal position
  let y = yStart;

  maritalStatuses.forEach((status) => {
    drawPyramid(countryData, status, x, y, pyramidWidth, pyramidHeight, countryData[0].country);
    x += pyramidWidth + 100; // Add spacing between pyramids
  });
}



function drawLegend() {
  let x = width * 0.82; // Top-right x-position
  let y = height * 0.05; // Start y-position
  let rectSize = 20; // Size of the rectangles

  textSize(15 * ratio);
  textAlign(LEFT, CENTER);
  fill(255); // White text color
  
  for (let continent in continentColors) {
    // Draw the colored rectangle
    fill(continentColors[continent]);
    rect(x, y, rectSize, rectSize);

    // Draw the continent name in white
    fill(255);
    text(continent, x + rectSize + 10, y + rectSize / 2);

    // Move down for the next entry
    y += rectSize + 10;
  }
}

function drawCountryArc(x, y, radius, country) {
  let total = country.proportions.reduce((sum, value) => sum + value, 0);
  let startAngle = 0; // Start at the top (0 degrees)
  let baseColor = pieColors[country.continent]; // Using pieColors for the color palette

  // Ensure proportions sum to 360 degrees
  country.proportions.forEach((value, i) => {
    if (activeCategories[i]) { // Check if the category is active
      let shadeIndex = Math.min(i, baseColor.length - 1); // Safely get shade index
      let fillColor = baseColor[shadeIndex]; // Select color from palette
      fill(fillColor);

      // Calculate the angle for this proportion
      let angle = (value / total) * TWO_PI; // TWO_PI is equivalent to 360 degrees in radians
      arc(x, y, radius * 2, radius * 2, startAngle, startAngle + angle, PIE);

      // Update the starting angle for the next arc
      startAngle += angle;
    }
  });

  // Draw the label below the pie chart
  fill(255);
  textSize(15 * ratio);
  textAlign(CENTER, CENTER);
  text(country.name, x, y + radius + 25); // Adjust the position below the pie chart
}


