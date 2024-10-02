const chart2 = document.getElementById("bubble-chart-1");

const labels2 = ['Ageing', 'Affordable Housing', 'Agriculture', 'Arts and Culture', 'Climate Action and Environment', 'Conservation', 'Education', 'Employability', 'Energy', 'Financial Inclusion', 'Gender', 'Governance', 'Health', 'Livelihood and Poverty Alleviation', 'Nutrition', 'Water and Sanitation and Hygiene'];

const percentageData = [16, 17, 33, 19, 58, 58, 63, 38, 30, 34, 38, 20, 52, 51, 23, 29];

const maxRadius = 40; // Set the maximum bubble size
const minRadius = 10; // Set the minimum bubble size

// Function to scale the radius based on percentage
const scaleRadius = (percentage) => {
  const scale = (maxRadius - minRadius) / 100;
  return minRadius + (percentage * scale); // Scale the radius based on the percentage
};

const data2 = {
  labels: labels2, // Use labels2 array for x-axis labels
  datasets: [
    {
      label: 'Percentage',
      data: percentageData.map((percentage, index) => ({
        x: index, // Use the index as x value
        y: percentage,        // Use the percentage as the y-axis value
        r: scaleRadius(percentage) // Dynamically scale the radius based on the percentage
      })),
      backgroundColor: "#f27c38",
      borderWidth: 1,
      borderColor: "#E8F6FF",
      hoverBackgroundColor: "#f27c38"
    }
  ]
};

new Chart(chart2, {
  type: 'bubble',
  data: data2,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 40 // Add extra padding to the bottom to accommodate rotated labels
      }
    },
    scales: {
      x: {
        title: {
          display: false, // Remove the x-axis title
        },
        grid: {
          display: true, // Show x-axis gridlines across the canvas
          drawBorder: true, // Draw the x-axis line
        },
        ticks: {
          font: {
            family: 'Open Sans', // Use Open Sans for x-axis labels
            size: 10 // Adjust font size to avoid label cutoff
          },
          min: 0, // Start the x-axis at index 0
          max: labels2.length - 1, // Set the max value to the last index of labels2
          stepSize: 1, // Ensure that each label is shown
          autoSkip: false, // Ensure that all labels are displayed
          callback: function(value) {
            return labels2[value]; // Use the index to match the label from labels2
          },
          maxRotation: 45, // Rotate the labels up to 45 degrees
          minRotation: 25 // Ensure a minimum of 30 degrees rotation
        }
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: true, // Show y-axis gridline
          drawBorder: true, // Draw the y-axis line
          drawOnChartArea: true, // Draw the gridline across the chart area
        },
        ticks: {
          font: {
            family: 'Open Sans', // Set Open Sans font for y-axis labels
            size: 10 // Adjust font size to avoid label cutoff
          },
          callback: function(value) {
            return value + '%'; // Append percent symbol to y-axis labels
          }
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const label = labels2[tooltipItem.dataIndex]; // Get the corresponding label from the labels array
            const percentage = tooltipItem.raw.y; // Get the percentage value (y-axis)
            return `${label}: ${percentage}%`; // Display label and percentage
          }
        },
        titleFont: {
          family: 'Open Sans', // Set Open Sans for tooltip title
        },
        bodyFont: {
          family: 'Open Sans', // Set Open Sans for tooltip body
        }
      }
    },
    animation: {
      onComplete: function() {
        console.log("Animation completed");
      },
      delay: function(context) {
        const index = context.dataIndex; // Gets the index of the bubble
        const delayBetweenPoints = 150; // Delay in milliseconds between bubbles
        return index * delayBetweenPoints; // Each bubble appears with a delay
      }
    }
  }
});
