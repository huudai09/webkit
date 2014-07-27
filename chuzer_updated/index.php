<?php
include_once 'db.php';
    $id = uniqid();
    if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
        echo "<pre style='text-align:left; height: 500px; overflow-y: scroll;'>";
        print_r($_REQUEST);
        die();
    }
?>
<!doctype html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">            
        <title>Chuzer Select</title>
        <link rel="stylesheet" href="style.css">
        <script src="jquery-1.9.0.js"></script>
        <script src="chuzer.js"></script>          
        <script>
            $(function(){
                $(this).find('.select-chuzer').chuzer();
                
                
                $('.select-chuzer.okok').on('change', function(){
                    window.console.log('Changed to: ' + this.value);
                });
                
                $('.select-chuzer.okok').on('click', function(){
                    window.console.log('Default selected: ' + this.value);
                });
                
                $('#<?php echo $id; ?>').on('change', function(){
                    alert(this.value);
                });
                
                $('#trigger').on('click', function(e){
                    e.preventDefault();
                    var options = ['<option selected value="10">', 'Cell', '</option>'].join('');
                    $('select[name="7dragonball"]').append(options).trigger('liszt:updated');
                });
                
            });
        </script>        
        <style>
            body{font-family: Helvetica; background: #FCFEFF}
            #form{
                margin: 50px auto;
                width: 95%;    
            }
            
            fieldset{                                
                background: #fff;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.2);
                margin: 0;
            }
            
        </style>
    </head>
    <body>
        <form method="post" id="form">
            <fieldset>                            
                <legend><h3>Select box Plugins</h3></legend>
                <button id="trigger">Trigger Liszt Update</button>
                <h4> Single select </h4>
                <select disabled class="select-chuzer aa" name="disabled">                    
                </select>

                <h4> Selected select </h4>
                <select id="<?php echo $id; ?>" 
                        onclick="(function(){alert(this.value)})" 
                        js-remove-item="(function(){console.log(this.value);})"
                        class="select-chuzer leeee" name="7dragonball" data-placeholder="Chọn nhân vật">                    
                    <option value="1">Songoku</option>
                    <option value="2">Cadic</option>
                    <option value="3">Krilin</option>
                    <option value="4">Songohan</option>                        
                </select>

                <h4> Single select </h4>
                <select class="select-chuzer bbb ccc" 
                        onclick="(function(){alert(this.value);})" 
                        onchange="(function(){console.log(this.value);})" 
                        js-remove-item="(function(){console.log(this.value);})"
                        name="locations" data-placeholder="Chọn địa chỉ">
                    <option value="1">Việt Nam</option>
                    <option disabled value="52">Hà Nội</option>
                    <option value="53">Quận Ba Đình</option>
                    <option value="54">Quận Cầu Giấy</option>
                    <option value="55">Quận Đống Đa</option>
                    <option value="56">Quận Hai Bà Trưng</option>
                    <option selected value="57">Quận Hoàn Kiếm</option>
                    <option value="58">Quận Tây Hồ</option>
                    <option value="59">Quận Thanh Xuân</option>
                    <option value="60">Huyện Đông Anh</option>
                    <option value="61">Huyện Gia Lâm</option>
                    <option value="62">Huyện Thanh Trì</option>
                    <option value="63">Huyện Từ Liêm</option>
                    <option value="64">Huyện Sóc Sơn</option>
                    <option value="65">Quận Hoàng Mai</option>
                    <option value="66">Quận Long Biên</option>
                    <option value="67">Huyện Mê Linh</option>                 
                </select>

                <h4> Select by group </h4>
                <select class="select-chuzer okok" name="name" data-placeholder="Chọn tên">
                    <optgroup label="A">
                        <option selected value="Nguyễn An">Nguyễn An</option>
                        <option value="Trần Anh">Trần Anh</option>
                    </optgroup>
                    <optgroup label="Á">
                        <option value="Nhật Ánh">Nhật Ánh</option>
                        <option value="Lan Ánh">Lan Ánh</option>
                    </optgroup>
                    <optgroup label="B">
                        <option value="Vỹ Bình">Vỹ Bình</option>
                        <option value="Thiết Bảng">Thiết Bảng</option>
                    </optgroup>
                    <optgroup label="C">
                        <option value="Phương Chinh">Phương Chinh</option>
                        <option value="Quỳnh Chi">Quỳnh Chi</option>
                    </optgroup>
                    <optgroup label="Đ">
                        <option value="Ngọc Đường">Ngọc Đường</option>
                        <option value="Xuân Định">Xuân Định</option>
                    </optgroup>                    
                </select>

                <h4> Multiply select </h4>                
                <select class="select-chuzer plplpl" name="properties[]" multiple="multiple"  data-placeholder="Chọn tài sản">
                    <option value="53">Bảng viết</option>
                    <option selected value="11">Dụng cụ thuyết trình</option>
                    <option value="23">Ghế</option>
                    <option value="10">Hộp đựng giấy in</option>
                    <option selected value="52">Kệ để đồ</option>
                    <option value="24">Két sắt</option>
                    <option value="26">Lò nướng</option>
                    <option value="25">Lò vi sóng</option>
                    <option value="28">Màn chiếu</option>
                    <option value="27">Máy ảnh</option>
                    <option value="29">Máy chấm công</option>
                    <option value="30">Máy chiếu</option>
                    <option value="32">Máy Fax</option>
                    <option value="33">Máy hút bụi</option>
                    <option value="34">Máy in</option>
                    <option value="35">Máy pha café</option>
                    <option value="36">Máy photo</option>
                    <option value="37">Máy quay phim</option>
                    <option value="38">Máy Scan</option>
                    <option value="31">Máy đếm tiền</option>
                    <option value="39">Micro</option>
                    <option value="16">Nội thất văn phòng</option>
                </select>
                
                <h4>Limit display</h4>
                <select class="select-chuzer" name="limited_display[]" multiple="multiple"  data-placeholder="Chọn tỉnh thành phố">
                    <?php foreach ( $res as $k => $a ):?>
                    <option value="<?php echo $a['ID'] ?>"><?php echo $a['title'] ?></option>
                    <?php endforeach;?>
                </select>

                <p><button type="submit">Cập nhật</button></p>
            </fieldset>
        </form>
    </body>
</html>  