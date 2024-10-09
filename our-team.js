// Create a variable for the new JSON file URL
let reflectionURL = new URL('https://brylliant-dev.github.io/avpn/our-team.json');

// Define a function to get team data and populate tabs
function getTeamData() {
    // Create a request variable and assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // Convert the URL object to a string
    let url = reflectionURL.toString();

    // Open a GET request to the URL
    request.open('GET', url, true);

    // Define what happens when the request loads
    request.onload = function() {
        // Parse the JSON response into a JavaScript object
        let data = JSON.parse(this.response);

        // Check if the request was successful
        if (request.status >= 200 && request.status < 400) {
            // Sort the data by SortOrder
            data.sort((a, b) => a.SortOrder - b.SortOrder);

            // Remove the original static tab and content to avoid conflicts
            $('.review_team_tabs_menu').empty();
            $('.review_team_tabs_content').empty();

            // Group the team members by 'Team'
            let groupedTeams = data.reduce((acc, teamItem) => {
                let tabTitle = teamItem['Team'];
                if (!acc[tabTitle]) {
                    acc[tabTitle] = [];
                }
                acc[tabTitle].push(teamItem);
                return acc;
            }, {});

            // Loop through each group and create tabs and contents
            Object.keys(groupedTeams).forEach(function(tabTitle, tabIndex) {
                // Create the tab button for this team group
                let $tabButton = $('<a>', {
                    class: 'review_team_tabs_item w-inline-block w-tab-link ' + (tabIndex === 0 ? 'w--current' : ''),
                    'data-w-tab': 'Tab ' + (tabIndex + 1),
                    href: '#w-tabs-2-data-w-pane-' + tabIndex,
                    role: 'tab',
                    'aria-controls': 'w-tabs-2-data-w-pane-' + tabIndex,
                    'aria-selected': tabIndex === 0
                }).append($('<h4>', {
                    class: 'heading-22 tab-title',
                    text: tabTitle
                }));

                $('.review_team_tabs_menu').append($tabButton);

                // Create the tab content container with an unordered list
                let $tabContent = $('<div>', {
                    class: 'review_team_tabs_content-item w-tab-pane ' + (tabIndex === 0 ? 'w--tab-active' : ''),
                    'data-w-tab': 'Tab ' + (tabIndex + 1),
                    id: 'w-tabs-2-data-w-pane-' + tabIndex,
                    role: 'tabpanel',
                    'aria-labelledby': 'w-tabs-2-data-w-tab-' + tabIndex
                }).append($('<ul>', {
                    class: 'w-list-unstyled team-list'
                }));

                $('.review_team_tabs_content').append($tabContent);

                // Get the list of team members for this group
                let teamMembers = groupedTeams[tabTitle];

                // Loop through the team members and add them to the list
                teamMembers.forEach(function(teamItem) {
                    // Create list item for each team member
                    let $listItem = $('<li>').append(
                        $('<div>', {
                            class: 'team_list-item_wrapper'
                        }).append(
                            $('<div>', {
                                class: 'team_list-item_text'
                            }).append(
                                $('<p>', {
                                    class: 'heading-20 is-bold team-name',
                                    text: teamItem['Name']
                                }),
                                $('<div>', {
                                    class: 'text-size-16 team-designation',
                                    text: teamItem['Designation']
                                })
                            ),
                            $('<div>', {
                                class: 'team_list-item_image-wrapper'
                            }).append(
                                $('<img>', {
                                    class: 'img-full-width team-img',
                                    src: teamItem['Image'],
                                    alt: teamItem['Name'],
                                    sizes: "(max-width: 991px) 112px, 13vw"
                                })
                            )
                        )
                    );

                    // Append the list item into the unordered list inside the tab content
                    $tabContent.find('ul.team-list').append($listItem);
                });
            });

            // Reinitialize Webflow tabs after populating content
            Webflow.require('tabs').ready();
        }
    };

    // Send the request to load the team data
    request.send();
}

// Run the getTeamData function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getTeamData();
});
