/** 
 * The Distance Finder application takes in two locations and calculates the distance
 * between them.
 */
var runApp = function () {
    'use strict';

    var runCal = null,
        outputResults = null,
        setCurrentCoords = null,
        currentLat = 0,
        currentLong = 0,
        addNumberField = null,
        performCal = null,
        addButton = null,
        initButtons = null,
        addForm = null,
        initApp = null,
        addTitle = null,
        addSubTitle = null,
        updateStartFields = null,
        updateEndFields = null,
        updateStartCoords = null,
        updateEndCoords = null,
        outputDistance = null;

    outputDistance = function (distance) {
        var body = document.querySelector('body'),
            distanceMiles = distance * 0.000621371,
            newDistance = document.createElement('div'),
            oldDistance = null;

        newDistance.id = 'distance';
        newDistance.innerHTML = '<p>The distance between the two points is ' + distanceMiles.toFixed(2) + ' miles.</p>';

        if (body.children.distance === undefined) {
            body.appendChild(newDistance);
        } else {
            oldDistance = body.children.distance;
            body.replaceChild(newDistance, oldDistance);
        }
    };

    outputResults = function (questOptions) {
        var body = document.querySelector('body'),
            newMapCanvas = document.createElement('div'),
            mapOptions = {
                center: questOptions.startingLocation,
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.HYBRID
            },
            startMarkerOptions = {
                position: questOptions.startingLocation,
                title: 'Route starts here!'
            },
            finishMarkerOptions = {
                position: questOptions.endingLocation,
                title: 'Route ends here!'
            },
            lineCoordinates = [questOptions.startingLocation, questOptions.endingLocation],
            map = null,
            startMarker = null,
            finishMarker = null,
            line = null,
            distance = 0,
            oldMapCanvas = null;

        distance = google.maps.geometry.spherical.computeDistanceBetween(questOptions.startingLocation,
            questOptions.endingLocation);
        outputDistance(distance);

        newMapCanvas.id = 'mapCanvas';

        if (body.children.mapCanvas === undefined) {
            body.appendChild(newMapCanvas);
        } else {
            oldMapCanvas = body.children.mapCanvas;
            body.replaceChild(newMapCanvas, oldMapCanvas);
        }

        map = new google.maps.Map(newMapCanvas, mapOptions);
        startMarker = new google.maps.Marker(startMarkerOptions);
        startMarker.setMap(map);
        finishMarker = new google.maps.Marker(finishMarkerOptions);
        finishMarker.setMap(map);
        line = new google.maps.Polyline({
            strokeColor: '#f00',
            fillColor: '#f00',
            path: lineCoordinates,
            map: map
        });
    };

    performCal = function (currentLocation) {
        var content = document.getElementById('content'),
            formMain = content.children.formMain,
            endingLat = formMain.children.endingLat.value,
            endingLong = formMain.children.endingLong.value,
            questOptions = null;

        questOptions = {
            startLat: currentLocation.lat,
            startLong: currentLocation.long,
            endLat: endingLat,
            endLong: endingLong
        };

        outputResults(questOptions);
    };

    updateStartFields = function () {
        var content = document.getElementById('content'),
            formMain = content.children.formMain.children;

        formMain.startingLat.value = currentLat;
        formMain.startingLong.value = currentLong;
    };

    updateEndFields = function () {
        var content = document.getElementById('content'),
            formMain = content.children.formMain.children;

        formMain.endingLat.value = currentLat;
        formMain.endingLong.value = currentLong;
    };

    updateStartCoords = function (position) {
        currentLat = position.coords.latitude.toFixed(7);
        currentLong = position.coords.longitude.toFixed(7);
        updateStartFields();
    };

    updateEndCoords = function (position) {
        currentLat = position.coords.latitude.toFixed(7);
        currentLong = position.coords.longitude.toFixed(7);
        updateEndFields();
    };

    setCurrentCoords = function (event) {
        if (navigator.geolocation) {

            if (this.id === 'currentLocationStartBtn') {
                navigator.geolocation.getCurrentPosition(updateStartCoords);
            } else {
                navigator.geolocation.getCurrentPosition(updateEndCoords);
            }

        } else {
            console.log('This browser doesn\'t support HTML5');
        }
        event.preventDefault();
    };

    /**
     * Runs the calculation process.
     * @param {event} event The action that occurs.
     */
    runCal = function (event) {
        var startingLat = this.form.children.startingLat.value,
            startingLong = this.form.children.startingLong.value,
            endingLat = this.form.children.endingLat.value,
            endingLong = this.form.children.endingLong.value,
            startingLocation = new google.maps.LatLng(startingLat, startingLong),
            endingLocation = new google.maps.LatLng(endingLat, endingLong),
            questOptions = {
                startingLocation: startingLocation,
                endingLocation: endingLocation
            };
        outputResults(questOptions);
        event.preventDefault();
    };

    /**
     * Initalizes the buttons for the form.
     * @param {form} form The form that contains the buttons.
     */
    initButtons = function (form) {
        var submitBtn = form.children.submitBtn,
            currentLocationStartBtn = form.children.currentLocationStartBtn,
            currentLocationEndBtn = form.children.currentLocationEndBtn;

        submitBtn.onclick = runCal;
        currentLocationStartBtn.onclick = setCurrentCoords;
        currentLocationEndBtn.onclick = setCurrentCoords;
    };

    /**
     * Adds a button to the form.
     * @param {form} form The form will be attached to.
     * @param {string} buttonName The name of the button.
     * @param {string} buttonId The id of the button.
     */
    addButton = function (form, buttonName, buttonId) {
        var button = document.createElement('input');

        button.type = 'submit';
        button.id = buttonId;
        button.value = buttonName;

        form.appendChild(button);
    };

    /**
     * Adds a number field and a label to the form.
     * @param {form} form The form that the number field and the label will be 
     *     attached to.
     * @param {string} labelName The name of the label.
     * @param {string} fieldId The id of the field.
     */
    addNumberField = function (form, labelName, fieldId) {
        var label = document.createElement('label'),
            field = document.createElement('input');

        label.innerHTML = labelName;
        field.id = fieldId;
        field.type = 'number';
        form.appendChild(label);
        form.appendChild(field);
    };

    /**
     * Adds a form to the content div.
     * @param {div} content The div tag that the form will be attached to.
     */
    addForm = function (content) {
        var form = document.createElement('form');

        form.id = 'formMain';
        addNumberField(form, 'Starting Lat', 'startingLat');
        form.appendChild(document.createElement('br'));
        addNumberField(form, 'Starting Long', 'startingLong');
        form.appendChild(document.createElement('br'));
        addButton(form, 'Use Current Location For Starting GPS position',
            'currentLocationStartBtn');
        form.appendChild(document.createElement('br'));
        addNumberField(form, 'Ending Lat', 'endingLat');
        form.appendChild(document.createElement('br'));
        addNumberField(form, 'Ending Long', 'endingLong');
        form.appendChild(document.createElement('br'));
        addButton(form, 'Use Current Location For Ending GPS position',
            'currentLocationEndBtn');
        form.appendChild(document.createElement('br'));
        addButton(form, 'Calculate Distance', 'submitBtn');
        content.appendChild(form);
        initButtons(form);
    };

    addSubTitle = function (content) {
        var subTitle = document.createElement('h3');

        subTitle.textContent = 'Find the distance between two location using GPS locations.';
        content.appendChild(subTitle);
    };

    /**
     * Adds the title to the content div.
     * @param {div} content The div tag that the title will be attached to.
     */
    addTitle = function (content) {
        var title = document.createElement('h1');

        title.textContent = 'Distance Finder';
        content.appendChild(title);
    };

    /**
     * Initializes the application.
     */
    initApp = function () {
        var body = document.getElementsByTagName('body'),
            content = document.createElement('div');

        content.id = 'content';
        //addTitle(content);
        addSubTitle(content);
        addForm(content);
        body[0].appendChild(content);
    };

    initApp();
};

window.onload = runApp;