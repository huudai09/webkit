<?php

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    $s = $_REQUEST['s'];
    $data = array(
        array(
            ID => 1,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Hữu Đại'
        )
        , array(
            ID => 2,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Góc khuất'
        )
        , array(
            ID => 3,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Hương'
        )
        , array(
            ID => 32,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Hương:abc'
        )
        , array(
            ID => 438,
            type => 'G',
            img => 'imgs/img.jpg',
            name => 'Hội những người chân đất Việt Nam'
        )
        , array(
            ID => 4,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Minhnd'
        )
        , array(
            ID => 5,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Giang NT'
        )
        , array(
            ID => 6,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Ty Coon'
        )
        , array(
            ID => 7,
            type => 'U',
            img => 'imgs/img.jpg',
            name => 'Nguyễn Xuân Tài'
        )
        , array(
            ID => 8,
            type => 'G',
            img => 'imgs/img.jpg',
            name => 'A Little Crab'
        )
        , array(
            ID => 9,
            type => 'G',
            img => 'imgs/img.jpg',
            name => 'Đào Nguyệt'
        )
        , array(
            ID => 10,
            type => 'G',
            img => 'imgs/img.jpg',
            name => 'Đào Thị Ngoan'
        )
        , array(
            ID => 123,
            type => 'G',
            img => 'imgs/img.jpg',
            name => '†† Công Nghệ Thông Tin 5.2 - K4 BKHY ††'
        )
    );

    $datas = array();
    foreach ( $data as $value ) {
        if ( preg_match( "/$s/i", $value['name'] ) ) {
            array_push( $datas, $value );
        }
    }

    die( json_encode( $datas ) );
}
?>
