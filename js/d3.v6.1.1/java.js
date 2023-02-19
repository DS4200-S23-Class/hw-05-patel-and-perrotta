// Frame dimensions set up as variables 
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.bottom;

 // Mouseover function
 function handleMouseOver(event, d) {
	d3.select(this).style("fill", "#00c");
}

// MouseLeave function
function handleMouseLeave(event, d) {
	d3.select(this).style("fill", "#CC0000");
}

// Add border to points if it is not there and remove border if it is there and show coordinate of point
function onClick(event, d) {
	// If there is border, remove border and show coordinates
	if (d3.select(this).attr("stroke") !== "none") {
        d3.select(this).attr("stroke", "none")
        d3.select(this).attr("stroke-width", "5")

        // console.log(typeof d.x)

        if (typeof d.x !== 'string') {
        	d3.select("#showPoint").text("Last Point Clicked: (" + x_coord + "," + y_coord + ")")
        } else {
			d3.select("#showPoint").text("Last Point Clicked: (" + d.x + "," + d.y + ")")

        }
	    // Otherwise, show border and coordinates
	    } else {
	        d3.select(this).attr("stroke", "black")
	       	d3.select(this).attr("stroke-width", "5")

			if (typeof d.x !== 'string') {
        		d3.select("#showPoint").text("Last Point Clicked: (" + x_coord + "," + y_coord + ")")
			} else {
				d3.select("#showPoint").text("Last Point Clicked: (" + d.x + "," + d.y + ")")

			        }
		    };
		};


function pointClicked(point){
	// variable to store the point
	let clickedPt = document.getElementById(point);

	// variable to store text that tells user the last point clicked
	let newText = "Last Point Clicked: " + point;

	// assign the variable to the id 
	document.getElementById("showPoint").innerHTML = newText;
}

const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const xScale = d3.scaleLinear()
.range([MARGINS.left, FRAME_WIDTH - MARGINS.right]);

const yScale = d3.scaleLinear()
.range([FRAME_HEIGHT - MARGINS.bottom, MARGINS.top]);

function scatterPlot() {
	// reading data from scatter plot csv 
	d3.csv("data/scatter-data.csv").then((data) => {

		// Find max of y-coorindate point
		const MAX_Y = d3.max(data, (d) => {
			return parseInt(d.y)
		}) 

		// Scale for y 
		const Y_SCALE = d3.scaleLinear()
							.domain([0, (MAX_Y)])
							.range([VIS_HEIGHT, 0]);

		// Find max of x-coorindate point  
		const MAX_X = d3.max(data, (d) => {
			return parseInt(d.x)
		});

		// Scale for x
		const X_SCALE = d3.scaleLinear()
							.domain([0, (MAX_X)])
							.range([0, VIS_WIDTH]);

		// Title
        FRAME1.append("text")
	        .attr("x", MARGINS.left + VIS_WIDTH/2)
	        .attr("y", MARGINS.top - 25)
	        .attr('text-anchor', "middle")
	        .style("font-size", 18)
	        .text("Scatter Plot");
        
        // X label
        FRAME1.append("text")
	        .attr("x", MARGINS.left + VIS_WIDTH/2)
	        .attr("y", VIS_HEIGHT + 125)
	        .attr("text-anchor", "middle")
	        .style("font-size", 12)
	        .text("x");
        
        // Y label
        FRAME1.append("text")
	        .attr("text-anchor", "middle")
	        .attr("x", MARGINS.left - 50)
	        .attr("y", VIS_HEIGHT - 100)
	        .style("font-size", 12)
	        .text("y");

	    // Add tick marks for x axis
		FRAME1.append("g")
			.attr("transform", 
				"translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(d3.axisBottom(X_SCALE).ticks(9))
				.attr("font-size", "10px");
		
		// Add tick marks for y axis 
		FRAME1.append("g")
			.attr("transform", 
				"translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
			.call(d3.axisLeft(Y_SCALE).ticks(9))
				.attr("font-size", "10px");

		// Plot scatter plot
        FRAME1.append("g")
	        .selectAll("dot")
	        .data(data)
	        .enter()
	        .append("circle")
	        .attr("cx", (d) => {return X_SCALE(d.x) + MARGINS.left;})
			.attr("cy", (d) => {return Y_SCALE(d.y) + MARGINS.top;})
	        .attr("r", 10)
	        .style("fill", "#CC0000")
	        .attr("class", "point")
	        .attr("stroke", "none");

		// Add event listeners to the points for mouseover, mouseleave, and onclick
		FRAME1.selectAll(".point")
				.on("mouseover", handleMouseOver)
				.on("mouseleave", handleMouseLeave)
				.on("click", onClick); 
	});
}
scatterPlot();