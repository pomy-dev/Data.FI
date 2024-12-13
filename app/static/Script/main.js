document.addEventListener("DOMContentLoaded", function () {
    const messages = document.querySelectorAll('.flash-message');
    messages.forEach((message) => {
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => {
                message.remove();
            }, 500); // Wait for fade-out transition to complete
        }, 3000); // Time before the message starts fading out
    });
});

// printing and converting cadas starts here
//  Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#cadas-to-excel');
const cada_table = document.getElementById('card-body')

const toExcel = function (table) {

    const t_heads = table.querySelectorAll('thead th'),
        tbody_rows = table.querySelectorAll('tbody tr'),
        user_rows = table.querySelectorAll('tfoot tr.hidden-row'),
        topic = table.querySelector('p')
    let title = ''

    if (topic) {
        title = [topic].map(sentence => {
            let actual_topic = sentence.textContent.trim().split('');
            return actual_topic.splice(0, actual_topic.length).join('').toUpperCase();
        }).join('\t') + '\t';

        const headings = [...t_heads].map(head => {
            let actual_head = head.textContent.trim().split('');
            return actual_head.splice(0, actual_head.length).join('').toUpperCase();
        }).join('\t') + '\t';

        const table_data = [...tbody_rows].map(row => {
            const cells = row.querySelectorAll('td'),
                data = [...cells].map(cell => cell.textContent.trim()).join('\t');

            return data;
        }).join('\n');

        const user_data = [...user_rows].map(row => {
            const cells = row.querySelectorAll('th'),
                user = [...cells].map(cell => cell.textContent.trim()).join('\t').toUpperCase();
            return user;
        });

        return title + '\n' + '\n' + headings + '\n' + table_data + '\n' + '\n' + user_data;

    } else {
        const headings = [...t_heads].map(head => {
            let actual_head = head.textContent.trim().split('');
            return actual_head.splice(0, actual_head.length).join('').toUpperCase();
        }).join('\t') + '\t';

        const table_data = [...tbody_rows].map(row => {
            const cells = row.querySelectorAll('td'),
                data = [...cells].map(cell => cell.textContent.trim()).join('\t');

            return data;
        }).join('\n');

        const user_data = [...user_rows].map(row => {
            const cells = row.querySelectorAll('th'),
                user = [...cells].map(cell => cell.textContent.trim()).join('\t').toUpperCase();
            return user;
        });

        return headings + '\n' + table_data + '\n' + '\n' + user_data;

    }

}

excel_btn.onclick = () => {
    const excel = toExcel(cada_table);
    downloadFile(excel, 'excel');
}

// printing Html 

const print_btn = document.querySelector('#cadas-print');

const printFile = function (table) {
    const html_code = `
                <!DOCTYPE html>
                
                <!-- Google Fonts -->
                <link href="https://fonts.gstatic.com" rel="preconnect">
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

                <!-- Vendor CSS Files -->
                <link href="../static/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
                <link href="../static/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
                <link href="../static/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
                <link href="../static/assets/vendor/quill/quill.snow.css" rel="stylesheet">
                <link href="../static/assets/vendor/quill/quill.bubble.css" rel="stylesheet">
                <link href="../static/assets/vendor/remixicon/remixicon.css" rel="stylesheet">
                <link href="../static/assets/vendor/simple-datatables/style.css" rel="stylesheet">

                <!-- Template Main CSS File -->
                <link href="../static/assets/css/style.css" rel="stylesheet">
                <link href="../static/css/style.css" rel="stylesheet">
                
                <main class="main" id="main">
                    <section class="section dashboard">
                        <div class="row">${table.innerHTML}</div>
                    </section>                   
                </main>
            `;

    const new_window = window.open();
    new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
}

print_btn.onclick = () => {
    printFile(cada_table);
}

// Converting HTML table to PDF

const pdf_btn = document.querySelector('#cadas-to-word');

const toPDF = function (table) {
    const {
        jsPDF
    } = window.jspdf;

    const doc = new jsPDF('p', 'pt', [1000, 1000]);
    doc.html(table, {
        callback: function (doc) {
            doc.save('newfile');
        },
        x: 10,
        y: 10,
        margin: [0, 0, 0, 0], // Remove margins
        autoPaging: true, // Enable auto paging
        windowWidth: 800
    })
}

pdf_btn.onclick = () => {
    toPDF(cada_table);
}

// printing and converting cadas ends here

// printing and converting filters starts here

const filter_excel_btn = document.querySelector('#table-to-excel');
const filter_table = document.getElementById('filtered-meetings');
// const pdf_table = document.getElementById('meeting-table');

filter_excel_btn.onclick = () => {
    const excel = toExcel(filter_table);
    downloadFile(excel, 'excel');
}

// printing Html 

const printFiltered_btn = document.querySelector('#filter-print');

printFiltered_btn.onclick = () => {
    printFile(filter_table);
}

// Converting HTML table to PDF

const pdf_File_btn = document.querySelector('#table-to-word');

pdf_File_btn.onclick = () => {
    toPDF(filter_table);
}

// dowload any file
const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// Hide and seek
const rightSection = document.getElementById('col-lg-8')
const upperSection = document.getElementById('col-lg-4')

const users = document.getElementById('users');
const usersView = document.getElementById('usersView');

users.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    usersView.style.display = 'block'

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    newUser.style.display = 'none'
    weekLogs.style.display = 'none'
    meeting_register.style.display = 'none'
    cadra.style.display = 'none'
    sheetsview.style.display = 'none'
    filters.style.display = 'none'
    profile_section.style.display = 'none'
});

const addUser = document.getElementById('addUser');
const newUser = document.getElementById('newUser');

addUser.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    newUser.style.display = 'block'

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    weekLogs.style.display = 'none'
    meeting_register.style.display = 'none'
    cadra.style.display = 'none'
    sheetsview.style.display = 'none'
    filters.style.display = 'none'
    profile_section.style.display = 'none'
});

const weekLogLink = document.getElementById('viewWeekLog');
const weekLogs = document.getElementById('weekLogs');

weekLogLink.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    weekLogs.style.display = 'block'

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    newUser.style.display = 'none'
    meeting_register.style.display = 'none'
    cadra.style.display = 'none'
    sheetsview.style.display = 'none'
    filters.style.display = 'none'
    profile_section.style.display = 'none'
});

const record_meeting = document.getElementById('record-meeting');
const meeting_register = document.getElementById('meeting-register');

record_meeting.addEventListener('click', function (event) {
    event.preventDefault();
    meeting_register.style.display = 'block'

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    newUser.style.display = 'none'
    weekLogs.style.display = 'none'
    cadra.style.display = 'none'
    sheetsview.style.display = 'none'
    filters.style.display = 'none'
    profile_section.style.display = 'none'
});

const cadra = document.getElementById('cadra');

const sheetslink = document.getElementById('sheet-link')
const sheetsview = document.getElementById('scanned-sheets');

sheetslink.addEventListener('click', function (event) {
    event.preventDefault();
    sheetsview.style.display = 'block';

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    newUser.style.display = 'none'
    weekLogs.style.display = 'none'
    cadra.style.display = 'none'
    meeting_register.style.display = 'none'
    filters.style.display = 'none'
    profile_section.style.display = 'none'
})

const filters = document.getElementById('filters');
document.getElementById('filter-meeting').addEventListener('click', function (event) {
    event.preventDefault()
    filters.style.display = 'block';

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    newUser.style.display = 'none'
    weekLogs.style.display = 'none'
    cadra.style.display = 'none'
    meeting_register.style.display = 'none'
    sheetsview.style.display = 'none';
    profile_section.style.display = 'none'
});

const profile_link = document.getElementById('my-profile');
const profile_section = document.getElementById('profile');

profile_link.addEventListener('click', function (event) {
    event.preventDefault();
    profile_section.style.display = 'block';

    upperSection.style.display = 'none'
    rightSection.style.display = 'none'
    usersView.style.display = 'none'
    newUser.style.display = 'none'
    weekLogs.style.display = 'none'
    cadra.style.display = 'none'
    meeting_register.style.display = 'none'
    filters.style.display = 'none'
    sheetsview.style.display = 'none';
});

// Function to fetch and display activities
async function fetchActivities() {
    const response = await fetch('/activities');
    const activities = await response.json();
    const tableList = document.getElementById('row-list');
    tableList.innerHTML = ''; // Clear the list

    activities.forEach(activity => {
        const row = document.createElement('tr');

        const cellid = document.createElement('td');
        cellid.scope = 'row'
        cellid.textContent = `${activity.id}`;

        const cellday = document.createElement('td');
        cellday.textContent = `${activity.day}`;

        const celldate = document.createElement('td');
        celldate.textContent = `${activity.date}`;

        const cellactivity = document.createElement('td');
        cellactivity.textContent = `${activity.activities}`;

        const cellaction = document.createElement('td');

        // Create the update button
        const anchorTag = document.createElement('a');
        anchorTag.href = '#'
        const spanTag = document.createElement('span')
        spanTag.classList.add('badge', 'bg-secondary', 'rounded-pill')
        spanTag.textContent = 'Update'
        anchorTag.appendChild(spanTag)
        spanTag.onclick = () => loadDayActivity(activity.id, activity.day, activity.date, activity.activities);

        // Create the delete button
        const deleteButton = document.createElement('span');
        deleteButton.classList.add('badge', 'bg-danger', 'rounded-pill')
        deleteButton.style.cursor = 'pointer'
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteWeekActivity(activity.id);

        cellaction.appendChild(anchorTag)
        cellaction.appendChild(deleteButton)

        row.appendChild(cellid);
        row.appendChild(cellday);
        row.appendChild(celldate);
        row.appendChild(cellactivity);
        row.appendChild(cellaction);
        tableList.appendChild(row);
    });
}

// function to fetch and display users
async function fetchUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '' //clearing the user list <ol> 

    users.forEach(user => {
        const row = document.createElement('li')
        row.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')

        const innerDiv = document.createElement('div');
        innerDiv.textContent = `${user.name}`;
        innerDiv.classList.add('ms-2', 'me-auto');

        const innerMostDiv = document.createElement('div')
        innerMostDiv.textContent = `${user.role}`;
        innerMostDiv.classList.add('fw-bold');

        innerDiv.appendChild(innerMostDiv);

        const updateButton = document.createElement('span');
        updateButton.classList.add('badge', 'bg-secondary', 'rounded-pill');
        updateButton.setAttribute('data-bs-toggle', 'modal');
        updateButton.setAttribute('data-bs-target', '#verticalycentered');
        updateButton.textContent = 'Update';
        updateButton.style.margin = '5px';
        updateButton.style.cursor = 'pointer';
        updateButton.onclick = () => loadUser(user.id, user.name, user.lastname, user.email, user.role, user.phone, user.country, user.company, user.address);

        const deleteButton = document.createElement('span');
        deleteButton.classList.add('badge', 'bg-danger', 'rounded-pill');
        deleteButton.textContent = 'Delete';
        deleteButton.style.margin = '5px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.onclick = () => deleteUser(user.id)

        row.appendChild(innerDiv);
        row.appendChild(updateButton);
        row.appendChild(deleteButton);
        userList.appendChild(row)
    });
}

// load user details into modal form
function loadUser(id, name, lastname, email, role, phone, country, company, address) {

    // Set the values in the modal
    document.getElementById('userId').value = id;
    document.getElementById('user_name').value = name;
    document.getElementById('user_lastname').value = lastname;
    document.getElementById('user_email').value = email;
    document.getElementById('user_role').value = role;
    document.getElementById('user_phone').value = phone;
    document.getElementById('user_country').value = country;
    document.getElementById('user_company').value = company;
    document.getElementById('user_address').value = address;
}

// load day activity details into upper form
function loadDayActivity(id, day, date, activity) {

    // Set the values in the modal
    document.getElementById('activityId').value = id;
    document.getElementById('day').value = day;
    document.getElementById('calendar').value = date;
    document.getElementById('activity').value = activity;
}

// Poll for new items every 1 seconds
setInterval(fetchUsers, 1000);
setInterval(fetchActivities, 1000);
setInterval(getFolders, 1000);

// Handle the save button click of week activity
document.getElementById('saveActivityChanges').onclick = async function () {
    const id = document.getElementById('activityId').value;
    const user = document.getElementById('user').value;
    const day = document.getElementById('day').value;
    const date = document.getElementById('calendar').value;
    const activity = document.getElementById('activity').value;

    if (id) {

        // Make an AJAX call to update the item
        const response = await fetch(`/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user,
                day: day,
                date: date,
                activity: activity
            }),
        });

        if (response.ok) {
            alert('Week Activity record deatils updated successfully!!')
            // Refresh the item list
            fetchActivities();
            document.getElementById('activityId').value = '';
            document.getElementById('day').value = '';
            document.getElementById('calendar').value = '';
            document.getElementById('activity').value = '';
        } else {
            alert('Failed to update the activity record');
        }
    } else {
        addWeekActivity(day, date, activity)
    }

};

// Handle the save button click of user update
document.getElementById('saveUserChange').onclick = async function () {
    const id = document.getElementById('userId').value;
    const uName = document.getElementById('user_name').value;
    const ulastname = document.getElementById('user_lastname').value;
    const uEmail = document.getElementById('user_email').value;
    const uRole = document.getElementById('user_role').value;
    const uPhone = document.getElementById('user_phone').value;

    if (id) {

        // Make an AJAX call to update the item
        const response = await fetch(`/changeUser/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: uName,
                lastname: ulastname,
                email: uEmail,
                role: uRole,
                phone: uPhone
            }),
        });

        if (response.ok) {
            // refresh the user list
            fetchUsers();
            // clear the modal form
            document.getElementById('user_name').value = '';
            document.getElementById('user_lastname').value = '';
            document.getElementById('user_email').value = '';
            document.getElementById('user_role').value = '';
            document.getElementById('user_phone').value = '';
        } else {
            alert('Failed to update the User record');
        }
    }
}

//add new week activity
function addWeekActivity(weekday, weekdate, dayactivity) {
    fetch('/weeklog', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            weekday: weekday,
            calendar: weekdate,
            activities: dayactivity
        })
    }).then(response => response.json()).then(data => {
        // Clear the input fields
        document.getElementById('day').value = "";
        document.getElementById('calendar').value = "";
        document.getElementById('activity').value = "";
    }).catch(error => {
        alert(`Error submitting data: ${error}`);
    });
}

function deleteWeekActivity(id) {
    alert("Are you sure to delete this Record? Any record deleted is permanantly removed!!");
    fetch(`/delete/${id}`, {
        method: 'POST',
    }).then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchActivities()
        });
}

document.getElementById('submitUserButton').onclick = async function () {
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const company = document.getElementById('company').value;
    const address = document.getElementById('address').value;

    addNewUser(name, lastname, email, password, role, phone, country, company, address);
}

function addNewUser(name, lastname, email, password, role, phone, country, company, address) {
    fetch('/addUser', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            lastname: lastname,
            email: email,
            password: password,
            role: role,
            phone: phone,
            country: country,
            company: company,
            address: address,
        })
    }).then(response => response.json()).then(data => {
        alert('New User has been successfully submitted!!')
        // Clear the input fields
        document.getElementById('name').value = "";
        document.getElementById('lastname').value = "";
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
        document.getElementById('role').value = "";
        document.getElementById('phone').value = "";
        document.getElementById('country').value = "";
        document.getElementById('company').value = "";
        document.getElementById('address').value = "";
    }).catch(error => {
        console.error('Error submitting data:', error);
    });
}

function deleteUser(id) {
    alert("Are you sure to delete this User Record? Any record deleted is permanantly removed!!");
    fetch(`/deleteUser/${id}`, {
        method: 'POST',
    }).then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchUsers()
        });
}

// code to add and remove row
document.getElementById('add-row').onclick = () => addRow();

let rowNum = 5;

function addRow() {
    const table_body = document.getElementById("table-rows");
    rowNum = rowNum + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <th scope="row">${rowNum}</th>
            <td><input type="text" id="name${rowNum}"></td>
            <td><input type="text" id="lastname${rowNum}"></td>
            <td><input type="text" id="organization${rowNum}"></td>
            <td class="sex_option">
                <select id="sex${rowNum}" id="" style="height:1.8rem;">
                    <option value="none">-----:-----</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </td>
            <td><input type="text" id="position${rowNum}"></td>
            <td><input type="number" id="phone${rowNum}"></td>
            <td><input type="email" id="email${rowNum}"></td>
        `;

    table_body.appendChild(newRow);
}

document.getElementById('refreshParticipants').onclick = function (event) {
    event.preventDefault();
    for (x = 1; x <= rowNum; x++) {
        document.getElementById(`name${x}`).value = '';
        document.getElementById(`lastname${x}`).value = '';
        document.getElementById(`organization${x}`).value = '';
        document.getElementById(`sex${x}`).value = '';
        document.getElementById(`position${x}`).value = '';
        document.getElementById(`phone${x}`).value = '';
        document.getElementById(`email${x}`).value = '';
    }
}

document.getElementById('resetFacilitators').onclick = function (event) {
    event.preventDefault();
    let x = 0
    for (x = 1; x <= 5; x++) {
        document.getElementById(`f-name${x}`).value = '';
        document.getElementById(`f-lastname${x}`).value = '';
        document.getElementById(`f-organization${x}`).value = '';
        document.getElementById(`f-sex${x}`).value = '';
        document.getElementById(`f-position${x}`).value = '';
        document.getElementById(`f-phone${x}`).value = '';
        document.getElementById(`f-email${x}`).value = '';
    }
}

document.getElementById('refreshMeetingHeader').onclick = () => {
    document.getElementById('meeting-title').value = '';
    document.getElementById('meeting-region').value = '';
    document.getElementById('meeting-date').value = '';
    document.getElementById('meeting-time').value = '';
    document.getElementById('meeting-venue').value = '';
}

// add meeting heading
document.getElementById('saveMeetingHeader').onclick = function () {
    const title = document.getElementById('meeting-title').value;
    const region = document.getElementById('meeting-region').value;
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const venue = document.getElementById('meeting-venue').value;

    addMeeting(title, region, date, time, venue);
}

function addMeeting(title, region, date, time, venue) {
    fetch('/recordMeeting', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title.toLowerCase(),
            region: region,
            date: date,
            time: time,
            venue: venue
        })
    }).then(response => response.json()).then(data => {
        alert('Meeting details saved successfully!!')
        // Clear the input fields
        document.getElementById('meeting-title').disabled = true;
        document.getElementById('meeting-region').disabled = true;
        document.getElementById('meeting-date').disabled = true;
        document.getElementById('meeting-time').disabled = true;
        document.getElementById('meeting-venue').disabled = true;
        document.getElementById('saveMeetingHeader').disabled = true;
        document.getElementById('refreshMeetingHeader').disabled = true;
    }).catch(error => {
        alert("Error: could not submit data!!");
    });
}

// add meeting facilitators
let meeting_id = 0
document.getElementById('saveFacilitators').onclick = async function () {

    const response = await fetch('/getMeetingId');
    meeting_record_id = await response.json();
    if (meeting_record_id) {
        meeting_id = meeting_record_id.id
    } else {
        alert('Could not find Meeting ID. Check With Administrator!!')
    }

    let x = 0
    for (x = 1; x <= 5; x++) {
        const name = document.getElementById(`f-name${x}`).value;
        const lastname = document.getElementById(`f-lastname${x}`).value;
        const organization = document.getElementById(`f-organization${x}`).value;
        const sex = document.getElementById(`f-sex${x}`).value;
        const position = document.getElementById(`f-position${x}`).value;
        const phone = document.getElementById(`f-phone${x}`).value;
        const email = document.getElementById(`f-email${x}`).value;

        if (name != '') {
            addFacilitators(x, name, lastname, organization, sex, position, phone, email, meeting_id)
        } else {
            continue;
        }
    }
    if (x >= 1) {
        alert('Facilitator(s) saved successfully.')
    } else {
        alert('Facilitator(s) did not save!!')
    }
}

function addFacilitators(point, name, lastname, organization, sex, position, phone, email, meeting_id) {
    fetch('/recordFacilitators', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            lastname: lastname,
            organization: organization,
            sex: sex,
            position: position,
            email: email,
            phone: phone,
            meetingId: meeting_id
        })
    }).then(response => response.json()).then(data => {
        // Clear the input fields
        document.getElementById(`f-name${point}`).disabled = true;
        document.getElementById(`f-lastname${point}`).disabled = true;
        document.getElementById(`f-organization${point}`).disabled = true;
        document.getElementById(`f-sex${point}`).disabled = true;
        document.getElementById(`f-position${point}`).disabled = true;
        document.getElementById(`f-phone${point}`).disabled = true;
        document.getElementById(`f-email${point}`).disabled = true;
        document.getElementById('saveFacilitators').disabled = true;
        document.getElementById('resetFacilitators').disabled = true;
    }).catch(error => {
        alert('Could not package the Facilitators\' details!!')
    });
}

document.getElementById('saveParticipants').onclick = async function () {

    const response = await fetch('/getMeetingId');
    meeting_record_id = await response.json();
    if (meeting_record_id) {
        meeting_id = meeting_record_id.id
    } else {
        alert('Could not find Meeting ID. Check With Administrator!!')
    }

    let x = 0
    for (x = 1; x <= rowNum; x++) {
        const name = document.getElementById(`name${x}`).value;
        const lastname = document.getElementById(`lastname${x}`).value;
        const organization = document.getElementById(`organization${x}`).value;
        const sex = document.getElementById(`sex${x}`).value;
        const position = document.getElementById(`position${x}`).value;
        const phone = document.getElementById(`phone${x}`).value;
        const email = document.getElementById(`email${x}`).value;

        addParticipants(name, lastname, organization, sex, position, phone, email, meeting_id)
    }
    if (x > 1) {
        // Clear the input fields on Meeting header
        document.getElementById('meeting-title').value = '';
        document.getElementById('meeting-region').value = '';
        document.getElementById('meeting-date').value = '';
        document.getElementById('meeting-time').value = '';
        document.getElementById('meeting-venue').value = '';
        alert('Participants saved successfully.')
        window.location.reload();
    } else {
        alert('Participants did not save!!')
    }
}

function addParticipants(name, lastname, organization, sex, position, phone, email, meeting_id) {
    fetch('/recordParticipants', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            lastname: lastname,
            organization: organization,
            sex: sex,
            position: position.toLowerCase(),
            email: email,
            phone: phone,
            meetingId: meeting_id
        })
    }).then(response => response.json()).then(data => {
        console.log('Successfully added participants.', data)
    }).catch(error => {
        alert('Could not package the Participants\' details!!');
    });
}

document.getElementById('deleteRow').onclick = function () {
    const tableBody = document.getElementById('t-body').getElementsByTagName('tbody')[0];
    const rowCount = tableBody.rows.length;
    if (rowCount > 5) {
        tableBody.deleteRow(rowCount - 1);
    } else {
        alert('Minimum rows is 5. Cannot delete any less rows!!')
    }
}

async function getMeetingDetails(id) {

    // get meeting details through API
    const response = await fetch(`/getMeetingDetails/${id}`);
    const details = await response.json();

    // remove default page
    document.getElementById('col-lg-8').style.display = 'none';
    document.getElementById('col-lg-4').style.display = 'none';


    document.getElementById('cadra').style.display = 'block';

    // load meeting details
    loadMeetingDetails(details.meeting, details.facilitators, details.participants);

}

function loadMeetingDetails(meeting, facilitators, participants) {
    // load meeting details
    if (meeting) {
        document.getElementById('m-title').innerHTML = `
            <i class="bi bi-clipboard-check"> ${meeting.title}
        `;
        document.getElementById('m-region').innerHTML = `
            <i class="bi bi-at"></i> ${meeting.region}
        `;
        document.getElementById('m-date').innerHTML = `
            <i class="bx bx-calendar-check"></i> ${meeting.date}
        `
        document.getElementById('m-time').innerHTML = `
            <i class="bi bi-clock-history"></i> ${meeting.time}
        `
        document.getElementById('m-venue').innerHTML = `
            <i class="bx bxs-clinic"></i> ${meeting.venue}
        `
    } else {
        alert('Could not load Meeting details!!')
    }

    // load facilitators
    if (facilitators) {
        let facilitator_container = document.getElementById('facilitators-list');
        facilitators.forEach(facilitator => {
            const new_facilitator_card = document.createElement('div');
            new_facilitator_card.classList.add('col-lg-3');
            new_facilitator_card.style.margin = '1rem';
            if (facilitator.sex == 'Female') {
                new_facilitator_card.innerHTML = `
                <div class="info-box card" style="padding: 1rem;">
                    <img src="../static/images/profile1.png" style="height: 3rem;width: 3rem;" alt="pic">
                    <h3>${facilitator.name}</h3>
                    <p>${facilitator.position},<br>${facilitator.organization}</p>
                </div>  
            `;
            } else {
                new_facilitator_card.innerHTML = `
                <div class="info-box card" style="padding: 1rem;">
                    <img src="../static/images/profile2.png" style="height: 3rem;width: 3rem;" alt="pic">
                    <h3>${facilitator.name}</h3>
                    <p>${facilitator.position},<br>${facilitator.organization}</p>
                </div>  
            `;
            }
            facilitator_container.appendChild(new_facilitator_card);
        });
    } else {
        alert('Could not load Facilitators!!')
    }

    // load participants
    if (participants) {
        let participant_container = document.getElementById('participant-list').getElementsByTagName('tbody')[0];
        const actions = document.getElementById('actions-dropdown');
        actions.innerHTML = '';
        var i = participants[1].meetingId;
        console.log(i);

        const div = document.createElement('div');

        const li1 = document.createElement('li');
        li1.classList.add('dropdown-header', 'text-start');
        li1.innerHTML = `<h6>Action</h6>`;
        div.appendChild(li1);

        const li2 = document.createElement('li');
        li2.id = 'table-to-excel';
        li2.innerHTML = `<a class="dropdown-item" href="#"><i class="bi bi-file-earmark-spreadsheet"></i>As Excel</a>`;
        div.appendChild(li2);

        const li3 = document.createElement('li');
        li3.id = 'table-to-pfd';
        li3.innerHTML = `<a class="dropdown-item" href="#"><i class="bi bi-file-earmark-pdf"></i>As PDF</a>`
        div.appendChild(li3);

        const li4 = document.createElement('li');
        li4.setAttribute('data-bs-toggle', 'modal');
        li4.setAttribute('data-bs-target', '#cadra-modal');
        li4.innerHTML = `<a class="dropdown-item" href="#"><i class="bi bi-clipboard-data"></i>View as Cadas</a>`
        li4.onclick = () => getCadra(i);
        div.appendChild(li4);

        const li5 = document.createElement('li');
        li5.id = 'table-to-print';
        li5.innerHTML = `<a class="dropdown-item" href="#"><i class="bx bx-printer"></i>Print</a>`
        div.appendChild(li5);

        const li6 = document.createElement('li');
        li6.id = 'table-to-share';
        li6.innerHTML = `<a class="dropdown-item" href="#"><i class="bi bi-share"></i>Share</a>`
        div.appendChild(li6);

        participants.forEach(participant => {
            const participant_row = document.createElement('tr');
            if (participant.sex == 'Female') {
                participant_row.innerHTML = `
                <td scope="row">${participant.name}</td>
                <td>${participant.lastname}</td>
                <td>${participant.organization}</td>
                <td><span class="badge bg-success">${participant.sex}</span></td>
                <td>${participant.position.toUpperCase()}</td> 
                <td>${participant.phone}</td>
                <td><a href="mail-to:${participant.email}">${participant.email}</a></td>
            `;
            } else {
                participant_row.innerHTML = `
                <td scope="row">${participant.name}</td>
                <td>${participant.lastname}</td>
                <td>${participant.organization}</td>
                <td><span class="badge bg-warning">${participant.sex}</span></td>
                <td>${participant.position}</td> 
                <td>${participant.phone}</td>
                <td><a href="mail-to:${participant.email}">${participant.email}</a></td>
            `;
            }
            participant_container.appendChild(participant_row);
        });

        actions.appendChild(div);

        // convert table to documents  starts here

        const participant_list_table = document.getElementById('table-participants');

        const table_excel = document.querySelector('#table-to-excel');
        table_excel.onclick = (e) => {
            e.preventDefault();
            const participant_table_excel = toExcel(participant_list_table);
            downloadFile(participant_table_excel, 'excel');
        }

        const table_pdf = document.querySelector('#table-to-pfd');
        table_pdf.onclick = (e) => {
            e.preventDefault();
            toPDF(participant_list_table);
        }

        const table_print = document.querySelector('#table-to-print');
        table_print.onclick = (e) => {
            e.preventDefault();
            printFile(participant_list_table);
        }

        //  convert table to documents ends here

    } else {
        alert('Could not load Participants!!')
    }

}

// load cadra
async function getCadra(id) {
    const response = await fetch(`/getCadra/${id}`);
    const data = await response.json()

    const meeting_details = data.meeting;

    document.getElementById('cadra-title').textContent = `Cadra details of ${meeting_details.title} dated ${meeting_details.date}.`;

    const cadra = data.cadra;

    const cadra_table = document.getElementById('cadra-table').getElementsByTagName('tbody')[0];
    cadra.forEach(row => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <tr>
                <td scope="row"><a href="#">${row.position.toUpperCase()}</a></td>
                <td>${row.males}</td>
                <td>${row.females}</td>
                <td>${row.total}</td>
            </tr>
        `;

        cadra_table.appendChild(tr);
    });
}

function hideCadra() {
    const table_rows = document.getElementById('cadra-table').getElementsByTagName('tbody')[0];
    table_rows.innerHTML = '';
}

async function getFolders() {
    const response = await fetch('/find-folders');
    const folders = await response.json();
    const folder_section = document.getElementById('iconslist');
    folder_section.innerHTML = '';
    folders.forEach(folder => {
        const folder_case = document.createElement('div');
        folder_case.classList.add('icon');
        folder_case.innerHTML = `
            <a href='/files/${folder.foldername}' target="blank">
                <i class="bi bi-folder"></i>
                <div class="label">${folder.foldername}</div>
            </a>
            `;
        folder_section.appendChild(folder_case);
    });
}

function closeFolder() {
    const folder_title = document.getElementById('folder-title');
    folder_title.innerText = '';
    document.getElementById('folder-name').value = ''
}

var searchInput, filter, table, tr, td, i, j, txtValue;
searchInput = document.getElementById('datasearch');
table = document.getElementById('participant-list');
tr = table.getElementsByTagName('tr');
searchInput.addEventListener('keyup', e => {
    filter = e.target.value.toUpperCase();

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = 'none';
        td = tr[i].getElementsByTagName('td')

        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.indexOf(filter) > -1) {
                    tr[i].style.display = '';
                    break;
                }
            }
        }
    }
    // const value = e.target.value.toLowerCase();
    // console.log(value);
    // thosePresent.forEach(man => {
    //     const isVisible =
    //         man.phone.toLowerCase.indexOf(value) ||
    //         man.email.toLowerCase;
    //     man.element.classList.toggle('hide', !isVisible)
    // })
})

document.getElementById('createFolder').addEventListener('click', function () {
    const foldername = prompt("Enter Folder Name:");
    if (foldername) {
        fetch('/create-folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderName: foldername
            })
        }).then(res => res.json()).then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert(data.error)
            }
        }).catch(error => console.error('Error:', error));
    }
})

function openFolder(folder_name) {
    const folder_title = document.getElementById('folder-title');
    document.getElementById('folder-name').value = `${folder_name}`;
    folder_title.innerHTML = `
        ${folder_name}
        <i class="bi bi-folder2-open"></i>
    `;
}

function save_File() {
    const folder = document.getElementById('folder-name').value;
    const file = document.getElementById('file-input').files[0];

    fetch('/savefile', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            folder: folder,
            file: file
        })
    }).then(response => response.json()).then(data => {
        alert(data.message);
    }).catch(error => {
        alert('Could not save file!!', error)
    });
}

function open_file(file_Url, file) {
    document.querySelector('#ExtralargeModal .modal-title').textContent = file;

    const viewer = document.querySelector('#ExtralargeModal .file-viewer');
    viewer.innerHTML = "";
    viewer.innerHTML = `<embed src="${file_Url}" style="height: 100%; width: 100%;"/>`
    // viewer.innerHTML = `<iframe src="https://docs.google.com/gview?url=${file_Url}&embedded=true" width="100%" height="100%"></iframe>`
    // viewer.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${file_Url}" width="100%" height="100%"></iframe>`
}

function remove_file(folder, file) {
    var isTrue = confirm(`Are you sure you want to remove ${file}. This file will be removed  permanently!`);
    if (isTrue) {

        fetch(`/remove_file/${folder}/${file}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                folder_name: folder,
                file_name: file
            })
        }).then(res => res.json()).then(mssg => {
            setTimeout(toastMssg(`${mssg.mssg}`), 5000);
            getFolders();
        }).catch(error => {
            alert(`Errror occured: ${error}`);
        })
    }

}

function toastMssg(note) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
    x.textContent = `${note}`;

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
        window.location.reload();
    }, 3000);
}

async function getAllMeeting() {
    const on = document.querySelector('[type="checkbox"]');

    if (on.checked === true) {
        const all_meetings = await fetch('/getAllMeetings');
        const data = await all_meetings.json();

        const topic = document.querySelector('#filtered-meetings p');
        topic.innerHTML = ''
        topic.textContent = 'List of all meetings that have been held.'

        const table = document.getElementById('meeting-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td scope="row">${row.date}</td>
                <td>${row.venue}</td>
                <td>${row.title}</td>
                <td>${row.time}</td>
                <td>${row.region}</td>
            `;
            table.appendChild(tr);
        })

    } else {
        alert('Looks like your checkbox was not clicked. Check it first and proceed.')
    }
}

document.getElementById('venue-meeting').addEventListener('click', async function (e) {
    e.preventDefault();
    const option = document.getElementById('select-venue').value;

    if (option != 'none') {
        const meeting = await fetch(`/getMeetingByVenue/${option}`);
        const data = await meeting.json();

        const topic = document.querySelector('#filtered-meetings p');
        topic.innerHTML = ''
        topic.textContent = `Meetings Grouped by: ${option}`

        const table = document.getElementById('meeting-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <th scope="row">${row.date}</th>
                    <td>${row.venue}</td>
                    <td>${row.title}</td>
                    <td>${row.time}</td>
                    <td>${row.region}</td>
                `;
            table.appendChild(tr);
        })
    } else {
        alert('Looks like you did not select Meeting Venue. Please do and proceed!!')
    }
})

async function getMeetingByActivity() {
    const activities = document.querySelectorAll('input[name="training"]');
    let selected = ''
    activities.forEach(option => {
        if (option.checked) {
            selected = option.value;
        }
    });

    if (selected != '') {
        const meeting = await fetch(`/getMeetingByActivity/${selected}`);
        const data = await meeting.json();

        const topic = document.querySelector('#filtered-meetings p');
        topic.innerHTML = ''
        topic.textContent = `Meetings Grouped by: ${selected}`

        const table = document.getElementById('meeting-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td scope="row">${row.date}</td>
                    <td>${row.venue}</td>
                    <td>${row.title}</td>
                    <td>${row.time}</td>
                    <td>${row.region}</td>
                `;
            table.appendChild(tr);
        })
    } else {
        alert('Looks like none option was selected, try again.')
    }
}

document.getElementById('requestDatedMeeting').addEventListener('click', function (e) {
    e.preventDefault();
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;

    const topic = document.querySelector('#filtered-meetings p');
    topic.innerHTML = ''
    topic.textContent = `Meetings Grouped by dates between: ${start} & ${end}`

    getMeetingByDate(start, end)
})

async function getMeetingByDate(start_date, end_date) {

    fetch(`/getMeetingByDate/${start_date}/${end_date}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            start_date: start_date,
            end_date: end_date
        })
    }).then(response => response.json())
        .then(data => {
            const table = document.getElementById('meeting-table').getElementsByTagName('tbody')[0];
            table.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td scope="row">${row.date}</td>
                        <td>${row.venue}</td>
                        <td>${row.title}</td>
                        <td>${row.time}</td>
                        <td>${row.region}</td>
                    `;
                table.appendChild(tr);
            })
        })
        .catch(error => {
            alert(`An error occurred: ${error}`);
        });
}

document.getElementById('first-quater').addEventListener('click', function (e) {
    e.preventDefault();
    const month = document.getElementById('quater1').value;

    const topic = document.querySelector('#filtered-meetings p');
    topic.innerHTML = ''
    topic.textContent = 'Meetings Grouped by the year first quater: January - March'

    getQuarter(month);
});

document.getElementById('sec-quater').addEventListener('click', function (e) {
    e.preventDefault();
    const month = document.getElementById('quater2').value;

    const topic = document.querySelector('#filtered-meetings p');
    topic.innerHTML = ''
    topic.textContent = 'Meetings Grouped by the year second quater: January - June'

    getQuarter(month);
});

document.getElementById('third-quater').addEventListener('click', function (e) {
    e.preventDefault();
    const month = document.getElementById('quater3').value;

    const topic = document.querySelector('#filtered-meetings p');
    topic.innerHTML = ''
    topic.textContent = 'Meetings Grouped by the year third quater: January - September'

    getQuarter(month);
});

document.getElementById('forth-quater').addEventListener('click', function (e) {
    e.preventDefault();
    const month = document.getElementById('quater4').value;

    const topic = document.querySelector('#filtered-meetings p');
    topic.innerHTML = ''
    topic.textContent = 'Meetings Grouped by the year forth quater: January - December'

    getQuarter(month);
});

async function getQuarter(month) {

    fetch('/yearQuarter', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lastQuater: month
        })
    }).then(response => response.json())
        .then(data => {
            const table = document.getElementById('meeting-table').getElementsByTagName('tbody')[0];
            table.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td scope="row">${row.date}</td>
                        <td>${row.venue}</td>
                        <td>${row.title}</td>
                        <td>${row.time}</td>
                        <td>${row.region}</td>
                    `;
                table.appendChild(tr);
            })
            if (data.length <= 0) {
                alert('None records were found of the specified year quater')
            } else {
                alert(`${data.length} records records found.`)
            }
        })
        .catch(error => {
            alert(`An error occurred: ${error}`);
        });
}

document.getElementById('change-profile').addEventListener('click', async function (event) {
    event.preventDefault();

    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-first-name').value;
    const lastname = document.getElementById('user-last-name').value;
    const company = document.getElementById('user-company-name').value;
    const role = document.getElementById('user-role').value;
    const country = document.getElementById('user-country').value;
    const address = document.getElementById('user-address').value;
    const phone = document.getElementById('user-phone').value;
    const email = document.getElementById('user-email').value;

    if (id) {

        // Make an AJAX call to update the item
        const response = await fetch(`/updateUser/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                lastname: lastname,
                company: company,
                role: role,
                country: country,
                address: address,
                phone: phone,
                email: email
            }),
        });

        if (response.ok) {
            alert('User deatils updated successfully!!')
            document.getElementById('user-first-name').value = data.name;
            document.getElementById('user-last-name').value = data.lastname;
            document.getElementById('user-company-name').value = data.company;
            document.getElementById('user-role').value = data.role;
            document.getElementById('user-country').value = data.country;
            document.getElementById('user-address').value = data.address;
            document.getElementById('user-phone').value = data.phone;
            document.getElementById('user-email').value = data.email;
        } else {
            alert('Failed to update the User profile record');
        }
    } else {
        alert('Could not find user. Try again.')
    }

})

document.getElementById('change-pass').addEventListener('click', async function (event) {
    event.preventDefault();

    const id = document.getElementById('user-id').value;
    const old_pass = document.getElementById('user-old-password').value;
    const new_pass = document.getElementById('user-new-password').value;
    const confirm_pass = document.getElementById('confirm-password').value;

    if (id) {

        // Make an AJAX call to update the item
        fetch(`/updateUserPass/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                old_pass: old_pass,
                new_pass: new_pass,
                confirm_pass: confirm_pass
            }),
        }).then(res => res.json()).then(info => {
            alert(`${info.mssg}`)
            document.getElementById('user-old-password').value = '';
            document.getElementById('user-new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }).catch(error => {
            alert(`Error occured: ${error}`)
        });
    } else {
        alert('Could not find user. Try again.')
    }

})