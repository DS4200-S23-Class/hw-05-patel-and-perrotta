// Setting up constants 
const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 600;
const MARGINS = {left: 50, right: 50,
				top: 50, bottom: 50};

// Constants for scaling purposes
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// create a frame for first vis in column 1
const FRAME1 = d3.select("#flex_left")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

// read data from first file
d3.csv("data/scatter-data.csv").then((data) => {

	console.log(data);

	// get maximum x and y coordinate values 
	const X_MAX = d3.max(data, d => {return parseInt(d.x)});
	const Y_MAX = d3.max(data, d => {return parseInt(d.y)});

	// Scaling x coordinates 
	const X_SCALE = d3.scaleLinear()
						.domain([0, (X_MAX)])
	    				.range([0, (Y_MAX * 50)]);

	// Scaling y coordinates
	const Y_SCALE = d3.scaleLinear()
						.domain([0, (Y_MAX)])
	    				.range([(Y_MAX * 50), 0]);

	// plot points from csv file 
	FRAME1.selectAll(".point")
					.data(data)
	    			.enter().append("circle")
	    						.attr("class", "point")
	    						.attr("cx", d => {
	    								return X_SCALE(parseInt(d.x)) + MARGINS.left
	    							})
	    						.attr("cy", d => {
	    								return Y_SCALE(parseInt(d.y)) + MARGINS.top
	    						})
	    						.attr("r", 10);

	// x-axis creation
	FRAME1.append("g")
      		.attr("transform", "translate(" + 
      			MARGINS.left+ "," + (MARGINS.top + VIS_HEIGHT) + ")")
      			.call(d3.axisBottom(X_SCALE).ticks(10));

	// y-axis creation
	FRAME1.append("g")
      		.attr("transform", "translate(" + 
      			MARGINS.left + "," + (MARGINS.top) + ")")
      		.call(d3.axisLeft(Y_SCALE).ticks(10));

	// handles functions for when a circle is clicked 
	function pointClicked() {
		
		// event listener 
		this.classList.toggle("addBorder");
		this.classList.toggle("point");

		// obtain x and y coordinates
		let x_var = (this.getAttribute("cx") / 50) - 1;
		let y_var = (500 - this.getAttribute("cy")) / 50;

		// stores text of last clicked circle / point
		let text1 = "Last point clicked: "
		let text2 = "(" + x_var +"," + y_var + ")"
		
		// updates the text for the last clicked circle 
		document.getElementById("point1").innerHTML = text1;
		document.getElementById("point2").innerHTML = text2;
	}

	// Create list of points
	let circles = document.getElementsByTagName("circle");

	// loop through all points
	for (let i = 0; i < circles.length; i++) {
		
	    // check each point for clicks
	    let circle = circles[i];
	    circle.addEventListener("click", pointClicked);
	}

	function addPoint() {
	// get the user input selections
	let xInput = document.getElementById("x_coordinate");
	let yInput = document.getElementById("y_coordinate");

	// get the values from the user selections
	let xCoord = xInput.value;
	let yCoord = yInput.value;

	// convert the values to the same ratio for the graph
	let x = (xCoord * 50);
	let y = 500 - (yCoord * 50);

	// add point
	FRAME1.append("circle")
	    	.attr("class", "point")
	    	.attr("cx", (x + MARGINS.left))
	    	.attr("cy", (y))
	    	.attr("r", 10);

	// loop through all points
	for (let i = 0; i < circles.length; i++) {
	    
	    // check each point for clicks
	    let circle = circles[i];
	    circle.addEventListener("click", pointClicked);
		}
	}

	// get the button Id
	let pointButton =  document.getElementById("createButton");
	// listen for a click
	pointButton.addEventListener("click", addPoint);
});

	const FRAME2 = d3.select("#flex_left")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

function build_barchart() {
	// read data from second file
	d3.csv("data/bar-data.csv").then((data) => {

		console.log(data);

		const MAX_Y2 = d3.max(data, (d) => {return parseInt(d.amount); });

		const X_SCALE2 = d3.scaleBand()
							.domain(data.map((d) => {return d.category}))
							.range([0, VIS_WIDTH]);

		const Y_SCALE2 = d3.scaleLinear()
							.range([VIS_HEIGHT, 0])
							.domain([0, MAX_Y2])

		// plot
		FRAME2.selectAll(".bar")
						.data(data)
		    			.enter().append("rect")
		    						.attr("class", "bar")
		    						.attr("x", d => {
		    								return X_SCALE2(d.category) + MARGINS.left
		    							})
		    						.attr("y", d => {
		    							return (Y_SCALE2(d.amount) + MARGINS.bottom)
		    						})
		    						.attr("width", X_SCALE2.bandwidth() - 5)
		    						.attr("height", d => {
		    							return (VIS_HEIGHT - Y_SCALE2(d.amount))
		    						})

		// add x-axis
		// create x-axis
		FRAME2.append("g")
	      		.attr("transform", "translate(" + 
	      			MARGINS.left+ "," + (MARGINS.top + VIS_HEIGHT) + ")")
	      			.call(d3.axisBottom(X_SCALE2).ticks(10));

		// create y-axis
		FRAME2.append("g")
	      		.attr("transform", "translate(" + 
	      			MARGINS.left + "," + (MARGINS.top) + ")")
	      		.call(d3.axisLeft(Y_SCALE2).ticks(10));

	    // create a tooltip
	    const TOOLTIP = d3.select("#flex_left")
							.append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);

		// Handles mouse over functionality 
		function handleMouseOver(event, d) {

			TOOLTIP.style("opacity", 1);
		}						

		// Handles mouse move functionality 
		function handleMouseMove(event, d) {

			TOOLTIP.html("Name: " + d.category + "<br>Value: " + d.amount)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 50) + "px");
		}

		// Handles mouse leave functionality (when mouse is not hovering over a point)
		function handleMouseLeave(event, d) {

			TOOLTIP.style("opacity", 0);
		}

		// set the frame with the events
		FRAME2.selectAll("rect")
			.on("mouseover", handleMouseOver)
			.on("mousemove", handleMouseMove)
			.on("mouseleave", handleMouseLeave);

	});
}

build_barchart();