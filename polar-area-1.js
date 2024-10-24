document.addEventListener("DOMContentLoaded", function () {
    const chartContainer = document.getElementById("polar-area-1");
    let myChart = null; // Variable to hold the polar area chart instance

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
            { label: ['Immigrants and asylum', 'seekers and refugees'], color: '#39627a', number: 14 },
            { label: ['Offenders and', 're-offenders'], color: '#86d1d1', number: 6 },
            { label: 'People in poverty', color: '#f59d6a', number: 58 },
            { label: ['People with', 'disabilities'], color: '#fee07e', number: 29 },
            { label: ['People with', 'medical needs'], color: '#80bdb4', number: 30 },
            { label: ['People without', 'employment'], color: '#9cb1bd', number: 37 },
            { label: 'Women and girls', color: '#c0deda', number: 62 },
        ];

        const chartDataSorted = chartData.sort((a, b) => a.number > b.number ? -1 : 1);

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
                    hoverBackgroundColor: chartDataSorted.map(cds => cds.color)
                }
            ]
        };

        const fontSize = window.innerWidth < 480 ? 10 : 16;
        myChart = new Chart(chartContainer, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true, // Keep the aspect ratio intact
                scales: {
                    r: {
                        pointLabels: {
                            display: true,
                            centerPointLabels: true,
                            color: '#002944',
                            font: {
                                size: fontSize,
                                family: 'Open Sans'
                            }
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
                                return tooltipItem.raw + '%';
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
        swiperSlides.forEach((slide) => {
            swiper.on('transitionEnd', function () {
                if (slide.classList.contains('swiper-slide-active')) {
                    if (slide.contains(chartContainer)) {
                        initializePolarAreaChart();
                    }
                }
            });
        });
    }

    // Start observing Swiper slide changes
    observeSwiperSlideChanges();
});
