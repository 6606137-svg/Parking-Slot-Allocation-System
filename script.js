const totalSlots = 12;

let parkingData = JSON.parse(
    localStorage.getItem("parkingData")
) || {};


// Display parking slots
function displaySlots() {

    const grid = document.getElementById("parkingGrid");
    const select = document.getElementById("slotSelect");

    grid.innerHTML = "";

    select.innerHTML =
        '<option value="">Select available slot</option>';


    for (let i = 1; i <= totalSlots; i++) {

        const slot = "A" + i;

        const div = document.createElement("div");

        div.classList.add("slot");


        // If slot is occupied
        if (parkingData[slot]) {

            div.classList.add("occupied-slot");

            div.innerHTML = `
                🅿️ ${slot}<br>
                <small>Occupied</small>
            `;

        }

        // If slot is available
        else {

            div.classList.add("available-slot");

            div.innerHTML = `
                🅿️ ${slot}<br>
                <small>Available</small>
            `;


            // Add available slot to dropdown
            const option = document.createElement("option");

            option.value = slot;

            option.textContent = slot;

            select.appendChild(option);
        }


        grid.appendChild(div);
    }


    updateDashboard();

    displayRecords();
}



// Update dashboard numbers
function updateDashboard() {

    const occupied =
        Object.keys(parkingData).length;

    const available =
        totalSlots - occupied;


    document.getElementById("totalSlots")
        .textContent = totalSlots;

    document.getElementById("availableSlots")
        .textContent = available;

    document.getElementById("occupiedSlots")
        .textContent = occupied;
}



// Allocate parking slot
document.getElementById("bookingForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const owner =
            document.getElementById("ownerName").value;

        const vehicle =
            document.getElementById("vehicleNumber").value;

        const hours =
            Number(
                document.getElementById("parkingHours").value
            );

        const slot =
            document.getElementById("slotSelect").value;


        // Check slot
        if (!slot) {

            alert("Please select a parking slot.");

            return;
        }


        // Parking rate
        const ratePerHour = 20;


        // Calculate fee
        const fee = hours * ratePerHour;


        // Store parking information
        parkingData[slot] = {

            owner: owner,

            vehicle: vehicle,

            hours: hours,

            fee: fee
        };


        // Save data
        localStorage.setItem(
            "parkingData",
            JSON.stringify(parkingData)
        );


        alert(
            "Parking Slot " +
            slot +
            " allocated successfully!\n\n" +
            "Parking Fee: ₹" +
            fee
        );


        // Clear form
        document.getElementById("bookingForm").reset();


        // Refresh page data
        displaySlots();

    });



// Display parking records
function displayRecords() {

    const table =
        document.getElementById("recordsTable");


    table.innerHTML = "";


    Object.keys(parkingData).forEach(slot => {

        const data =
            parkingData[slot];


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${slot}</td>

            <td>${data.owner}</td>

            <td>${data.vehicle}</td>

            <td>${data.hours} hour(s)</td>

            <td>₹${data.fee}</td>

            <td>Occupied</td>

            <td>

                <button
                    class="release-btn"
                    onclick="releaseSlot('${slot}')">

                    Release

                </button>

            </td>
        `;


        table.appendChild(row);

    });

}



// Release parking slot
function releaseSlot(slot) {

    if (
        confirm(
            "Release parking slot " +
            slot +
            "?"
        )
    ) {

        delete parkingData[slot];


        localStorage.setItem(
            "parkingData",
            JSON.stringify(parkingData)
        );


        displaySlots();
    }
}


// Start the system
displaySlots();