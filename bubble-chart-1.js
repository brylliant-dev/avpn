document.addEventListener("DOMContentLoaded", function () {
    const chartContainer = document.getElementById("bubble-chart-1");
    let myChart = null; // Variable to hold the bubble chart instance

    // Function to initialize the bubble chart
    function initializeBubbleChart() {
        if (myChart) {
            myChart.destroy();
        }

        const chartData = [
            { label: 'Ageing', percentage: 16 },
            { label: 'Agriculture', percentage: 33 },
            { label: 'Arts and Culture', percentage: 19 },
            { label: 'Affordable Housing', percentage: 17 },
            { label: 'Climate Action & Environment', percentage: 58 },
            { label: 'Conservation', percentage: 58 },
            { label: 'Education', percentage: 63 },
            { label: 'Employability', percentage: 38 },
            { label: 'Energy', percentage: 30 },
            { label: 'Financial Inclusion', percentage: 34 },
            { label: 'Gender', percentage: 38 },
            { label: 'Governance', percentage: 20 },
            { label: 'Health', percentage: 52 },
            { label: 'Livelihood & Poverty Alleviation', percentage: 51 },
            { label: 'Nutrition', percentage: 23 },
            { label: 'Water, Sanitation & Hygiene', percentage: 29 },
        ];

        const isMobile = window.innerWidth < 480;
        const maxRadius = isMobile ? 20 : 40;
        const minRadius = isMobile ? 5 : 10;
        const scaleRadius = (percentage) => {
            const scale = (maxRadius - minRadius) / 100;
            return minRadius + (percentage * scale);
        };

        const labels = chartData.map(cd => cd.label);
        const data = {
            labels,
            datasets: [
                {
                    label: 'Percentage',
                    data: chartData.map((cd, index) => ({
                        x: isMobile ? cd.percentage : index, // Swap x and y values on mobile
                        y: isMobile ? index : cd.percentage,
                        r: scaleRadius(cd.percentage)
                    })),
                    backgroundColor: "#f27c38",
                    borderWidth: 1,
                    borderColor: "#E8F6FF",
                    hoverBackgroundColor: "#f27c38"
                }
            ]
        };

        const xFontSize = isMobile ? 8 : 14; // Smaller font size for mobile
        const maxRotation = isMobile ? 90 : 45; // Increase rotation for better readability on mobile
        const paddingBottom = isMobile ? 140 : 40; // Increase bottom padding for mobile

        // Adjust scales based on mobile or desktop
        const scales = isMobile
            ? {
                x: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize }, // Adjust font size based on screen width
                        callback: function (value) { return value + '%'; },
                        beginAtZero: true,
                        max: 70,
                        stepSize: 10 // Set x-axis step size to 10 for mobile
                    }
                },
                y: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true, drawOnChartArea: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize }, // Adjust font size based on screen width
                        min: 0,
                        max: labels.length - 1,
                        stepSize: 1,
                        autoSkip: false,
                        callback: function (value) { return labels[value]; },
                        maxRotation: maxRotation, // Adjust rotation for better readability
                        minRotation: 0
                    }
                }
            }
            : {
                x: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize }, // Adjust font size based on screen width
                        min: 0,
                        max: labels.length - 1,
                        stepSize: 1, // Regular increment for desktop
                        autoSkip: false,
                        callback: function (value) { return labels[value]; },
                        maxRotation: maxRotation, // Adjust rotation for better readability
                        minRotation: 0
                    }
                },
                y: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true, drawOnChartArea: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize }, // Adjust font size based on screen width
                        callback: function (value) { return value + '%'; },
                        beginAtZero: true,
                        max: 70
                    }
                }
            };

        myChart = new Chart(chartContainer, {
            type: 'bubble',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: paddingBottom
                    }
                },
                scales: scales,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: {
                            family: 'Open Sans',
                            color: '#002944'
                        },
                        bodyFont: {
                            family: 'Open Sans',
                            color: '#002944'
                        },
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = labels[tooltipItem.dataIndex];
                                const percentage = isMobile ? tooltipItem.raw.x : tooltipItem.raw.y; // Use y for desktop, x for mobile
                                return `${percentage}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    delay: function (context) {
                        const index = context.dataIndex;
                        const delayBetweenPoints = 50;
                        return index * delayBetweenPoints;
                    }
                }
            }
        });
    }

    // Function to observe when Swiper slide becomes active
    function observeSwiperSlideChanges() {
        const swiperSlides = document.querySelectorAll('.review_members_slide.swiper-slide');
        swiperSlides.forEach((slide, index) => {
            swiper.on('transitionEnd', function () {
                if (slide.classList.contains('swiper-slide-active')) {
                    if (slide contains(chartContainer)) {
                        initializeBubbleChart();
                    }
                }
            });
        });
    }
    // Start observing Swiper slide changes
    observeSwiperSlideChanges();
});
