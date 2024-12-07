let table;
let filteredData = {};
let maxDataValue = 0; // To normalize the flow thickness

function preload() {
  table = loadTable('data/worldmarriage_edited.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255); // White background

  const selectedCountry = "Afghanistan";
  const yearStart = "1972";

  filteredData = filterAndAggregateData(selectedCountry, yearStart);
  calculateMaxDataValue(); // To find the maximum value for normalization

  drawSankeyDiagram();
}

function filterAndAggregateData(country, year) {
  let data = {};
  for (let row of table.rows) {
    let ageGroup = row.get('AgeGroup');
    let status = row.get('MaritalStatus');
    let value = parseFloat(row.get('DataValue'));

    if (!data[ageGroup]) {
      data[ageGroup] = {};
    }
    if (!data[ageGroup][status]) {
      data[ageGroup][status] = 0;
    }
    data[ageGroup][status] += value;
  }
  return data;
}

function calculateMaxDataValue() {
  // Calculate the maximum value to normalize the stroke weights
  for (let ageGroup in filteredData) {
    for (let status in filteredData[ageGroup]) {
      maxDataValue = Math.max(maxDataValue, filteredData[ageGroup][status]);
    }
  }
}

function drawSankeyDiagram() {
  const colors = {
    'Single': color(100, 200, 220, 150),
    'Married': color(255, 100, 100, 150),
    'Divorced': color(100, 100, 255, 150),
    'Widowed': color(200, 200, 100, 150)
  };

  const ageGroups = Object.keys(filteredData).sort();
  const statuses = ["Single", "Married", "Divorced", "Widowed"];

  let xSpacing = width / (ageGroups.length + 1);
  let ySpacing = height / (statuses.length + 1);

  textSize(16);
  textAlign(CENTER, CENTER);

  // Draw proportional bezier curves between each age group
  for (let i = 0; i < ageGroups.length - 1; i++) {
    let currentAge = ageGroups[i];
    let nextAge = ageGroups[i + 1];
    let currentX = xSpacing * (i + 1);
    let nextX = xSpacing * (i + 2);

    for (let status of statuses) {
      let currentY = (statuses.indexOf(status) + 1) * ySpacing;

      for (let nextStatus of statuses) {
        let nextY = (statuses.indexOf(nextStatus) + 1) * ySpacing;
        let currentValue = filteredData[currentAge][status] || 0;
        let nextValue = filteredData[nextAge][nextStatus] || 0;
        let proportion = (currentValue + nextValue) / 2; // Average for smoother transition

        stroke(colors[status]);
        strokeWeight(map(proportion, 0, maxDataValue, 1, 20)); // Normalize stroke weight

        // Control points for smoother curves
        let ctrlX1 = currentX + 0.3 * (nextX - currentX);
        let ctrlX2 = nextX - 0.3 * (nextX - currentX);

        bezier(currentX, currentY, ctrlX1, currentY, ctrlX2, nextY, nextX, nextY);
      }
    }
  }
}

function draw() {
  // Optionally add interactive elements or updates
}
