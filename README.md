# GetSwift-Code-Test
###_How did you implement your solution?_
I broke my ideas down into milestones:
First, I needed to lay out all of the information laid before me which included, hitting the APIs, understanding the response from the GET request, and getting the latitude and longitude coordinates of the depot. 
Next, I needed to brainstorm the best way to handle the constraints while still keeping in mind any edge cases; since the data was randomize there's no telling what extreme example could arise. I decided the best course of action was to get packages to the destination based on the deadline.
After brainstorming I gathered the tools and algorithms I would need to put my ideas into code. I, naturally, required http in order to get the data, and I consulted with StackOverflow for the algorithm to calculate distance between 2 coordinates rather than a simple delta x over delta y formula.
I could have skipped or removed the lines of code that put the data into another object, but during development I found it necessary to transmute the data into something understandable and easy to read. Once I had the relevant data sorted (i.e., distance from point A to point B, time it would take to travel, time it would take to deliver a package versus the deadline) it was much easier to plot out how I would iterate through the objects, do the calculations, and compare data.

###_Why did you implement it this way?_
As I mentioned before I created an extra step of creating another object to manipulate to ultimately create yet another object in the format that was requested to return. But I felt it necessary to understand the data I was manipulating to first get the correct solution, that way I have the opportunity to refactor and try to reduce the file size, and the run time of the script. As one would expect, submitting 2 GET requests and running a nested iteration over the 2 data objects is pretty slow.

As for the reasoning behind the steps I took to get to my solution I always like to lay out my plan of attack rather than brute forcing my code and performing trial and error. Habits like that lead to writing bad code.

###_Let's assume we need to handle dispatching thousands of jobs per second to thousands of drivers. Would the solution you've implemented still work? Why or why not? What would you modify? Feel free to describe a completely different solution than the one you've developed._
If this was to be deployed on a larger scale, it would work, but it definitely would not be efficient. First of all it would be too slow. Secondly, with much more examples, it can provide for more edge cases (i.e., what if a drone can drop off a package, pick up the next package, and have it delivered before the next available drone. While putting the data into another object before calculation is an issue, the biggest issue is the nested iteration. I would try to find a more efficient way to iterate through both sets of data without having the script to run at O^2^
