document.addEventListener("DOMContentLoaded", function () {
    const chartContainer = document.getElementById("bubble-chart-1");
    let myChart = null;

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
                        x: isMobile ? cd.percentage : index, 
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

        const xFontSize = isMobile ? 8 : 14;
        const maxRotation = isMobile ? 90 : 45;
        const paddingBottom = isMobile ? 140 : 40;

        const scales = isMobile
            ? {
                x: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize },
                        callback: (value) => `${value}%`,
                        beginAtZero: true,
                        max: 70,
                        stepSize: 10
                    }
                },
                y: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize },
                        min: 0,
                        max: labels.length - 1,
                        stepSize: 1,
                        autoSkip: false,
                        callback: (value) => labels[value],
                        maxRotation,
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
                        font: { family: 'Open Sans', size: xFontSize },
                        min: 0,
                        max: labels.length - 1,
                        stepSize: 1,
                        autoSkip: false,
                        callback: (value) => labels[value],
                        maxRotation,
                        minRotation: 0
                    }
                },
                y: {
                    title: { display: false },
                    grid: { display: true, drawBorder: true },
                    ticks: {
                        color: '#002944',
                        font: { family: 'Open Sans', size: xFontSize },
                        callback: (value) => `${value}%`,
                        beginAtZero: true,
                        max: 70
                    }
                }
            };

        myChart = new Chart(chartContainer, {
            type: 'bubble',
            data,
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
                scales,
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
                                const percentage = isMobile ? tooltipItem.raw.x : tooltipItem.raw.y;
                                return `${percentage}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    delay: (context) => context.dataIndex * 50
                }
            }
        });
    }

    function observeSwiperSlideChanges() {
        const swiperSlides = document.querySelectorAll('.review_members_slide.swiper-slide');
        swiperSlides.forEach(slide => {
            swiper.on('transitionEnd', function () {
                if (slide.classList.contains('swiper-slide-active') && slide.contains(chartContainer)) {
                    initializeBubbleChart();
                }
            });
        });
    }

    window.addEventListener('resize', initializeBubbleChart);

    initializeBubbleChart();
    observeSwiperSlideChanges();
});
