document.addEventListener("DOMContentLoaded", function () {
    const chartContainer = document.getElementById("polar-area-1");
    let myChart = null;

    // Function to initialize the polar area chart
    function initializePolarAreaChart() {
        if (myChart) {
            myChart.destroy();
        }

        const chartData = [
            { label: 'Children and youths', color: '#00b4ae', number: 65 },
            { label: 'Elderly', color: '#f27c38', number: 28 },
            { label: 'Environment', color: '#ffd552', number: 44 },
            { label: 'Ethnic minorities', color: '#007b69', number: 27 },
            { label: ['Immigrants,', 'asylum seekers,', 'and refugees'], color: '#39627a', number: 14 },
            { label: ['Offenders', 'and re-offenders'], color: '#86d1d1', number: 6 },
            { label: 'People in poverty', color: '#f59d6a', number: 58 },
            { label: ['People with', 'disabilities'], color: '#fee07e', number: 29 },
            { label: ['People with', 'medical needs'], color: '#80bdb4', number: 30 },
            { label: ['People without', 'employment'], color: '#9cb1bd', number: 37 },
            { label: 'Women and girls', color: '#c0deda', number: 62 },
        ];

        const chartDataSorted = chartData.sort((a, b) => b.number - a.number);
        const data = {
            labels: chartDataSorted.map(cds => cds.label),
            datasets: [
                {
                    label: 'Percentage',
                    data: chartDataSorted.map(cds => cds.number),
                    backgroundColor: chartDataSorted.map(cds => cds.color),
                    borderWidth: 1,
                    borderColor: "#E8F6FF",
                    borderRadius: 4,
                    hoverBackgroundColor: chartDataSorted.map(cds => cds.color),
                }
            ]
        };

        const isMobile = window.innerWidth < 480;
        const fontSize = isMobile ? 7 : 14; // Smaller font size for mobile
        const padding = isMobile ? 10 : 10; // Increased padding on mobile to prevent overlap

        myChart = new Chart(chartContainer, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: padding,
                        bottom: padding,
                        left: padding,
                        right: padding,
                    }
                },
                scales: {
                    r: {
                        pointLabels: {
                            display: true,
                            centerPointLabels: true,
                            color: '#002944',
                            font: {
                                size: fontSize,
                                family: 'Open Sans',
                            },
                            textAlign: 'center'
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
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
                                return `${tooltipItem.raw}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    function observeSwiperSlideChanges() {
        const swiperSlides = document.querySelectorAll('.review_members_slide.swiper-slide');
        swiperSlides.forEach(slide => {
            swiper.on('transitionEnd', function () {
                if (slide.classList.contains('swiper-slide-active') && slide.contains(chartContainer)) {
                    initializePolarAreaChart();
                }
            });
        });
    }

    // Handle responsive chart re-initialization on window resize
    window.addEventListener('resize', initializePolarAreaChart);

    // Initialize the chart on first load and start observing Swiper slide changes
    initializePolarAreaChart();
    observeSwiperSlideChanges();
});
