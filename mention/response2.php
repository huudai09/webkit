<?php

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    $s = $_REQUEST['val'];
    $data = array(            
            url => 'stackoverflow.com',
		   title => 'Paste event in Javascript',
		   content => 'The onpaste property returns the onPaste event handler code on the current element. 
					 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, praesentium, voluptate architecto 
					 ipsam nostrum sunt corrupti quas quaerat consectetur placeat ratione sed dolores expedita adipisci 
					 possimus ex magni at aspernatur?',
            imgs => array(
					'https://fbexternal-a.akamaihd.net/safe_image.php?d=AQAnltCA2wPK6XfE&w=398&h=208&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fmedia%2Fredesign%2Fimg%2Fopengraph-logo.png&cfs=1&upscale',
					'https://fbexternal-a.akamaihd.net/safe_image.php?d=AQB7XbbIlB3xozsS&w=100&h=100&url=http%3A%2F%2Fcdn.sstatic.net%2Fstackoverflow%2Fimg%2Fapple-touch-icon%402.png%3Fv%3Dfde65a5a78c6&cfs=1&upscale'
		         )            
        );

    die( json_encode( $data ) );
}
?>
