<?php
$dbinfo = 'mysql:dbname=test;host=localhost';
$user = 'root';
$pass = 'thaydoichinhminh';

$db = new PDO($dbinfo, $user, $pass);

function renderContent($content){
    return $content;
}

function updateRec($table, $fields, $cond = '') {
    global $db;
    if ( is_array($fields) ) {
        $new = array();
        foreach ( $fields as $key => $value ) {
            if ( !is_numeric( $value )) {
                $new[] = '`' . $key . '`' . '=' . '\'' . $value . '\'';
            }else{
                $new[] = '`' . $key . '`' . '=' . $value;
            }            
        }

        if ( !empty($cond) )
            $cond = 'WHERE ' . $cond;
        
        $new = implode(', ', $new);

        $sth = $db->prepare("UPDATE `$table` SET $new $cond ");
        $sth->execute();
    }

    return false;
}
if($_SERVER['REQUEST_METHOD'] === 'POST'){    
    $data = $_REQUEST;
    updateRec('mention', array(
        content => $data['content']
    ), "`ID`='1'");
    header('Location: index.php');
}else{
    $sth = $db->prepare("SELECT * FROM `mention` WHERE `ID` = '1'");
    $sth->execute();
    $post = $sth->fetchAll(PDO::FETCH_ASSOC);           
    $post = $post[0];    
}

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">  
  <link rel="stylesheet" href="style.css">
  <script src="jquery-1.9.0.js"></script>
  <script src="js2.js" async></script>
  <title>Mention plugin</title>
</head>
<body>
    <form action="" method="POST" style="display: inline-block;" name="FORM">
        <input type="hidden" js-mention="false" class="mention-input" js-atts="{&quot;placeholder&quot;:&quot;B\u1ea1n \u0111ang ngh\u0129 g\u00ec ?&quot;}" name="content" value="<?php echo !empty($post['content']) ? $post['content'] : '' ?>" />					       
        
        <div>
            <button>Cập nhật</button>
		   <button id="clearMention">Clear</button>
	</div>
    </form>   
    <div class="preview" style="display: block; white-space: pre-wrap;font-family: Tahoma; font-size: 11px;"><?php echo renderContent(!empty($post['content']) ? $post['content'] : '') ?></div>    		
</body>
</html>