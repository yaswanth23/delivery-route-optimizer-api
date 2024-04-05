# Delivery Route Optimizer (Lambda Function)

## Description

This Lambda function optimizes delivery routes using the Nearest Neighbor algorithm. It calculates the shortest path for deliveries by leveraging the Google Maps Distance Matrix API to determine distances between coordinates. The function iteratively finds the nearest unvisited location from the current location, updating the route until all locations are visited, resulting in an optimized delivery route.

## Overview

1. **Initialization:** The function receives an array of coordinates, sets the starting location to the first coordinate.
2. **Route Calculation:** The function iteratively calculates the shortest distance to each unvisited location from the current location, which utilizes the Google Maps Distance Matrix API.
3. **Route Construction:** Once the nearest location is identified, it is added to the route, and its details (including the address and the shortest distance text) are updated. The current location is then updated to this nearest location, and the process repeats until all locations have been visited.
4. **Error Handling:** Manages API call failures or issues with coordinates.
5. **Response:** Upon successful completion, the function returns a response containing the status code and the calculated route. In case of an error, it returns a status code of 500 along with an error message.

## Key Components

- **calculateRoute Function:** This function forms the core logic of route calculation. It iteratively finds the nearest unvisited location from the current location and updates the route accordingly.
- **calculateDistance Function:** Utilizing the Google Maps Distance Matrix API, this function calculates the distance and duration between two locations. It is essential for determining the shortest path during route calculation.

## Visualization and Testing

### Testing the Lambda Function with Postman

To test the Lambda function using Postman, you can use the following curl command:

```bash
curl --location 'https://611xkinx68.execute-api.ap-south-1.amazonaws.com/v1/calculate-route' \
--header 'Content-Type: application/json' \
--data '{
    "coordinates": [
        {
            "lat": 12.9784,
            "lng": 77.6408
        },
        {
            "lat": 12.9698,
            "lng": 77.7499
        },
        {
            "lat": 12.9352,
            "lng": 77.6245
        },
        {
            "lat": 13.1007,
            "lng": 77.5963
        },
        {
            "lat": 13.0359,
            "lng": 77.597
        }
    ]
}'
```

### Accessing the Web Interface

To streamline the testing and visualization process of the Delivery Route Optimizer Lambda function, a user-friendly web interface has been provided. This interface enables users to input a set of coordinates and witness the optimized delivery route calculated by the Lambda function in real-time.

To utilize this visualization tool, simply access the provided web interface by navigating to https://route-optimizer-ui.netlify.app/ in your preferred web browser.

### How to Use the Visualization Tool

1. **Access the Web Interface:** Navigate to https://route-optimizer-ui.netlify.app/ in your web browser.
2. **Accessing Sample Data:** If you don't have sample data, you can click on the `Click to Copy Sample JSON Data` button provided on the web interface. 

This button allows you to quickly copy the sample JSON data to your clipboard for pasting into the input field.
3. **Inputting Coordinates:** Now, input the sample data or your own data into the `Enter Delivery coordinates` textarea provided on the web interface.

You can either paste the copied sample JSON data or input your custom latitude and longitude coordinates directly into the textarea.
4. **Calculating Route:** After inputting the data, users can click on the `Calculate Route` button.
5. **Visualization of Optimized Route:** The web interface then displays the optimized delivery route on the map.
This visualization showcases the shortest path and any plotted points or route lines based on the provided coordinates.

## Stay in touch

- Author - [Yaswanth](https://github.com/yaswanth23)
- Website - [Github](https://github.com/yaswanth23)