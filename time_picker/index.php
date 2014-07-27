<!doctype html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <title>Time picker</title>
        <!--<link rel="stylesheet" href="css/style.css">-->
		<link rel="stylesheet" href="css/darken3.css">
        <script src="js/jquery-1.9.0.js"></script>
        <script src="js/time.picker.js"></script>  
		<style>
			html{background: #F0F0F0;}
		</style>
    </head>
    <body>
        <div id="time-picker">            
            <div class="time hour"></div>
            <div class="time min"></div>
            <div class="time sec"></div>
            <div class="select"></div>
			<div class="buttons">	
				<button class="lighten">&#x2714</button>
				<button>×</button>
			</div>
        </div>
        <div id="log"></div>

    </body>
</html>