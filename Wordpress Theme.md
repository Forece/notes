# 结构搭建

~~~
|--Assets
	|--img
	|--css
	|--js
	|--vendor
|--index.php
|--header.php
|--footer.php
|--404.php
|--style.css
~~~



# 结构分离

将 header, footer, content 分离



## 1. header.php

Header 中需要替换的几个 Wordpress API

~~~php+HTML
// 博客名称
<?php bloginfo('name'); ?>

// 博客地址
<?php bloginfo('url'); ?>

// 博客首页地址
<?php echo get_option('home'); ?>

// 博客描述
<?php bloginfo(’description’); ?>。

// 模板路径
<?php bloginfo('template_url')?>

// CSS 路径
<?php bloginfo('stylesheet_url'); ?>

// 引入 header 文件
<?php get_header(); ?>

// 引入 footer 文件
<?php get_footer(); ?>

// 引入 sidebar 文件
<?php get_sidebar(); ?>

<?php wp_head(); ?> 用于包含WordPress程序输出头部信息
<?php wp_list_categories(); ?> 用于列出博客分类页
<?php wp_list_pages(); ?> 用于列出博客页面

is_home()，is_single()，is_category()等几个条件判断标签
~~~



bloginfo 参数

- 默认 name

- '**name**' - 显示在 设置 > 常规 中设置的“站点标题”。 该数据是从 wp_options 这个数据表中检索到的 "blogname"记录。
- '**description**' - 显示在 设置 > 常规 中设置的“副标题”。该数据是从 wp_options 这个数据表中检索到的 "blogdescription" 记录。
- '**wpurl**' - 显示在 设置 > 常规 中设置的 “WordPress 地址 (URL)”。该数据是从 wp_options 这个数据表中检索到的 "siteurl" 记录。 可以考虑使用 site_url() 来代替，尤其是在使用 子目录路径方式，而不是使用 子域名 来配置多站点时（bloginfo将返回根网站的URL，而不是子站点的URL）。
- '**siteurl**' / '**url**' - 显示在 设置 > 常规 中设置的 “站点地址（URL）”)”。该数据是从 wp_options 这个数据表中检索到的 "home"记录。 可以考虑使用 home_url() 代替。
- **'admin_email'** - 显示在 设置 > 常规 中设置的 “电子邮件地址”。该数据是从 wp_options 这个数据表中检索到的 "admin_email"记录。
- **'charset'** - 显示在 设置 > 常规 中设置的“页面和feed的编码”。该数据是从 wp_options 这个数据表中检索到的"blog_charset" 记录。（注：3.5.1+好像已经没有这个选项了）
- **'version'** - 显示你当前使用的 WordPress 版本。该数据是在 wp-includes/version.php 检索到的 $wp_version 这个字段的值。
- **'html_type'** - 显示WordPress HTML 页面中的内容类型（默认： "text/html"）。该数据可以从 wp_options 这个数据表中检索到的 "html_type" 记录。主题和插件可以通过使用 [pre_option_html_type](http://codex.wordpress.org/Plugin_API/Filter_Reference) 过滤器覆盖默认值。
- **'text_direction'** - 显示 WordPress HTML 页面的文本方向。可以考虑使用 is_rtl() 代替。
- **'language'** - 显示WordPress的语言。
- **'stylesheet_url'** - 显示当前使用的主题的 CSS文件（通常为 style.css）路径。可以考虑使用 get_stylesheet_uri() 代替。
- **'stylesheet_directory'** - 显示当前使用的主题的样式表路径。可以考虑使用 get_stylesheet_directory_uri() 代替。
- **'template_url'** / **'template_directory'** - 当前主题的 URL 路径 。在子主题中， get_bloginfo('template_url') 和 get_template() 都将返回父主题的目录。可以考虑使用 [get_template_directory_uri()](http://codex.wordpress.org/Function_Reference/get_template_directory_uri) （用于父主题目录）或[get_stylesheet_directory_uri()](http://codex.wordpress.org/Function_Reference/get_stylesheet_directory_uri) （用于子主题目录）代替。
- **'pingback_url'** - 显示通告文件 XML-RPC 的URL (xmlrpc.php)
- **'atom_url'** - 显示 Atom feed URL (/feed/atom)
- **'rdf_url'** - 显示 RDF/RSS 1.0 feed URL (/feed/rfd).
- **'rss_url'** - 显示 RSS 0.92 feed URL (/feed/rss).
- **'rss2_url'** - 显示 RSS 2.0 feed URL (/feed).
- **'comments_atom_url'** - 显示评论的 Atom feed URL (/comments/feed).
- **'comments_rss2_url'** - 显示评论的 RSS 2.0 feed URL (/comments/feed).



get_option 参数可以参考数据库中的 options 表



~~~php
/* SEO */
add_action ( 'wp_head', 'wp_keywords' ); // 添加关键字
add_action ( 'wp_head', 'wp_description' ); // 添加页面描述
 
function wp_keywords() {
 global $s, $post;
 $keywords = '';
 if (is_single ()) { //如果是文章页，关键词则是：标签+分类ID
 if (get_the_tags ( $post->ID )) {
  foreach ( get_the_tags ( $post->ID ) as $tag )
  $keywords .= $tag->name . ', ';
 }
 foreach ( get_the_category ( $post->ID ) as $category )
  $keywords .= $category->cat_name . ', ';
 $keywords = substr_replace ( $keywords, '', - 2 );
 } elseif (is_home ()) {
 $keywords = '我是主页关键词'; //主页关键词设置
 } elseif (is_tag ()) { //标签页关键词设置
 $keywords = single_tag_title ( '', false );
 } elseif (is_category ()) {//分类页关键词设置
 $keywords = single_cat_title ( '', false );
 } elseif (is_search ()) {//搜索页关键词设置
 $keywords = esc_html ( $s, 1 );
 } else {//默认页关键词设置
 $keywords = trim ( wp_title ( '', false ) );
 }
 if ($keywords) { //输出关键词
 echo "<meta name=\"keywords\" content=\"$keywords\" />\n";
 }
}

function wp_description() {
 global $s, $post;
 $description = '';
 $blog_name = get_bloginfo ( 'name' );
 if (is_singular ()) { //文章页如果存在描述字段，则显示描述，否则截取文章内容
 if (! empty ( $post->post_excerpt )) {
  $text = $post->post_excerpt;
 } else {
  $text = $post->post_content;
 }
 $description = trim ( str_replace ( array (
  "\r\n",
  "\r",
  "\n",
  "　",
  " " 
 ), " ", str_replace ( "\"", "'", strip_tags ( $text ) ) ) );
 if (! ($description))
  $description = $blog_name . "-" . trim ( wp_title ( '', false ) );
 } elseif (is_home ()) {//首页显示描述设置
 $description = $blog_name . "-" . get_bloginfo ( 'description' ) .'首页要显示的描述'; // 首頁要自己加
 } elseif (is_tag ()) {//标签页显示描述设置
 $description = $blog_name . "有关 '" . single_tag_title ( '', false ) . "' 的文章";
 } elseif (is_category ()) {//分类页显示描述设置
 $description = $blog_name . "有关 '" . single_cat_title ( '', false ) . "' 的文章";
 } elseif (is_archive ()) {//文档页显示描述设置
 $description = $blog_name . "在: '" . trim ( wp_title ( '', false ) ) . "' 的文章";
 } elseif (is_search ()) {//搜索页显示描述设置
 $description = $blog_name . ": '" . esc_html ( $s, 1 ) . "' 的搜索結果";
 } else {//默认其他页显示描述设置
 $description = $blog_name . "有关 '" . trim ( wp_title ( '', false ) ) . "' 的文章";
 }
 //输出描述
 $description = mb_substr ( $description, 0, 220, 'utf-8' ) . '..';
 echo "<meta name=\"description\" content=\"$description\" />\n";
}
~~~



~~~php
<?php
$description = '';
$keywords = '';

if (is_home() || is_page()) {
   // 将以下引号中的内容改成你的主页description
   $description = "露兜博客描述";

   // 将以下引号中的内容改成你的主页keywords
   $keywords = "WordPress, 博客, 编程,php,ludou";
}
elseif (is_single()) {
   $description1 = get_post_meta($post->ID, "description", true);
   $description2 = str_replace("\n","",mb_strimwidth(strip_tags($post->post_content), 0, 200, "…", 'utf-8'));

   // 填写自定义字段description时显示自定义字段的内容，否则使用文章内容前200字作为描述
   $description = $description1 ? $description1 : $description2;
   
   // 填写自定义字段keywords时显示自定义字段的内容，否则使用文章tags作为关键词
   $keywords = get_post_meta($post->ID, "keywords", true);
   if($keywords == '') {
      $tags = wp_get_post_tags($post->ID);    
      foreach ($tags as $tag ) {        
         $keywords = $keywords . $tag->name . ", ";    
      }
      $keywords = rtrim($keywords, ', ');
   }
}
elseif (is_category()) {
   // 分类的description可以到后台 - 文章 -分类目录，修改分类的描述
   $description = category_description();
   $keywords = single_cat_title('', false);
}
elseif (is_tag()){
   // 标签的description可以到后台 - 文章 - 标签，修改标签的描述
   $description = tag_description();
   $keywords = single_tag_title('', false);
}
$description = trim(strip_tags($description));
$keywords = trim(strip_tags($keywords));
?>
<meta name="description" content="<?php echo $description; ?>" />
<meta name="keywords" content="<?php echo $keywords; ?>" />
~~~





~~~php
<?php
if (is_home()) {
	$description = "首页描述";
	$keyword = "首页关键词";
} elseif (is_single()) {
	$description = get_the_excerpt() ? get_the_excerpt('') : mb_substr(strip_tags(get_the_content('')), 0, 150);
	$keywords = get_the_tags();
	$keyword = '';
	foreach ($keywords as $value) {
		$keyword .= ','.$value->name;
	}
}
?>
<meta name="keywords" content="<?php echo $keyword ;?>" />
<meta name="description" content="<?php echo $description ;?>" />
~~~





~~~php

<?php
	//直接给个默认的
	$description = "XXXX";
	$keywords = "XXX,XXX,XXX,XXXX";
	if(is_home()){
		
	}elseif(is_single()){
		if ($post->post_excerpt) {
			$description = $post->post_excerpt;
		}elseif($post->post_content){
			$description = strip_tags($post->post_content);
			$description = strip_shortcodes($post->post_content);
			$description = str_replace(array("\n", "\r", "\t"), '', $description);
			$description = preg_replace('/<.*?>/', '', $description);
			$description = mb_substr(strip_tags($description),0,300,'utf-8');
		}
	} else {
		$description = mb_substr(strip_tags($post->post_content),0,300,'utf-8');
	}
	//过滤
	$description = str_replace(array("\n", "\r", "\t"), '', $description);
	$description = preg_replace('/<.*?>/', '', $description);
	
	//$keywords = "";
	$tags = wp_get_post_tags($post->ID);
	foreach ($tags as $tag) {
		$keywords = $keywords . ",". $tag->name;
	}
	//去掉前后逗号
	$keywords= preg_replace('/^,/','',$keywords);
	$keywords = preg_replace('/,$/','',$keywords);
?>
<meta name="keywords" content="<?php echo $keywords; ?>" />
<meta name="description" content="<?php echo $description; ?>" />
~~~





### 1.1 更改 Title

title 标签要放到最下

~~~php
<title><?php if ( is_home() ) {
		bloginfo('name'); echo " - "; bloginfo('description');
	} elseif ( is_category() ) {
		single_cat_title(); echo " - "; bloginfo('name');
	} elseif (is_single() || is_page() ) {
		single_post_title();
	} elseif (is_search() ) {
		echo "搜索结果"; echo " - "; bloginfo('name');
	} elseif (is_404() ) {
		echo '页面未找到!';
	} else {
		wp_title('',true);
	} ?></title>
~~~



~~~php
<title>
<?php 
if (function_exists('is_tag') && is_tag()) { 
	echo 'Tag Archive for "'.$tag.'" - '; 
} elseif (is_archive()) { 
	wp_title(''); echo ' Archive - '; 
} elseif (is_search()) { 
	echo 'Search for "'.wp_specialchars($s).'" - '; 
} elseif (!(is_404()) && (is_single()) || (is_page())) { 
	wp_title(''); echo ' - '; 
} elseif (is_404()) {
	echo 'Not Found - '; 
}
bloginfo('name');
?>
</title>
~~~



~~~php
<?php if (function_exists('is_tag') && is_tag()) {
    single_tag_title("Tag Archive for ");
    echo '" - ';
} elseif (is_archive()) {
    wp_title('');
    echo ' Archive - ';
} elseif (is_search()) {
    echo 'Search for "' . wp_specialchars($s) . '" - ';
} elseif (!(is_404()) && (is_single()) || (is_page())) {
    wp_title('');
    echo ' - ';
} elseif (is_404()) {
    echo 'Not Found - ';
}
if (is_home()) {
    bloginfo('name');
    echo ' - ';
    bloginfo('description');
} else {
    bloginfo('name');
} ?>
<?php if ($paged > 1) {
    echo ' - page ' . $paged;
} ?>
~~~



~~~php
<title>
<?php
if (is_category()) {
	echo 'Category: '; wp_title(''); echo ' - ';

} elseif (function_exists('is_tag') && is_tag()) {
	single_tag_title('Tag Archive for "'); echo '" - ';

} elseif (is_archive()) {
	wp_title(''); echo ' Archive - ';

} elseif (is_page()) {
	echo wp_title(''); echo ' - ';

} elseif (is_search()) {
	echo 'Search for "'.wp_specialchars($s).'" - ';

} elseif (!(is_404()) && (is_single()) || (is_page())) {
	wp_title(''); echo ' - ';

} elseif (is_404()) {
	echo 'Not Found - ';

} bloginfo('name');
?>
</title>
~~~

https://perishablepress.com/how-to-generate-perfect-wordpress-title-tags-without-a-plugin/





~~~php
<?php 
// 如果是首页和文章列表页面, 显示博客标题 
if(is_front_page() || is_home()) { bloginfo('name'); 
    // 如果是文章详细页面和独立页面, 显示文章标题 
} else if(is_single() || is_page()) { wp_title(''); 
    // 如果是类目页面, 显示类目表述 
} else if(is_category()) { printf('%1$s 类目的文章存档', single_cat_title('', false)); 
    // 如果是搜索页面, 显示搜索表述 
} else if(is_search()) { printf('%1$s 的搜索结果', wp_specialchars($s, 1)); 
    // 如果是标签页面, 显示标签表述 
} else if(is_tag()) { printf('%1$s 标签的文章存档', single_tag_title('', false)); 
    // 如果是日期页面, 显示日期范围描述 
} else if(is_date()) { $title = ''; if(is_day()) { $title = get_the_time('Y年n月j日'); } else if(is_year()) { $title = get_the_time('Y年'); } else { $title = get_the_time('Y年n月'); } printf('%1$s的文章存档', $title); 
// 其他页面显示博客标题 
} else { bloginfo('name'); }
?>
~~~









- `is_home()`：当前页面为主页时返回true
- `is_category()`：当前页面为分类页时返回true
- `is_single()`：当前页面为单文章页时返回true
- `is_page()`：当前页面为单页面时返回true
- 更详细的内容参阅WordPress文档：[条件标签](https://www.ludou.org/go/wl-aHR0cDovL2NvZGV4LndvcmRwcmVzcy5vcmcvemgtY246JUU2JTlEJUExJUU0JUJCJUI2JUU2JUEwJTg3JUU3JUFEJUJF)



### 1.2 更改样式表路径

~~~php+HTML
<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
~~~



或者使用模板地址引用



~~~php+HTML
<link href="<?php bloginfo('template_url') ?>/style.css" rel="stylesheet">
~~~



### 1.3 添加 pingback

~~~php+HTML
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
~~~



### 1.4 添加博客名称和描述

- `<?php echo get_option('home'); ?>` 输出你的博客首页网址
- `<?php bloginfo('name'); ?>` 输出你的博客名称
- `<?php bloginfo('description'); ?>` 输出博客描述



### 1.5 添加订阅feed链接

~~~php
<link rel="alternate" type="application/rss+xml" title="RSS 2.0 - 所有文章" href="<?php echo get_bloginfo('rss2_url'); ?>" />
<link rel="alternate" type="application/rss+xml" title="RSS 2.0 - 所有评论" href="<?php bloginfo('comments_rss2_url'); ?>" />
~~~



### 1.6 添加wp_head

有些插件需要在网页头部执行一些类如添加一些js或css的动作，要让这些插件能够正常的工作，也让你的主题有更好的兼容性，你应该添加wp_head()函数。打开`header.php`，在`</head>`前面添加以下代码即可：

~~~php
<?php wp_head(); ?>
~~~



### 1.7 显示菜单栏

~~~php+HTML
<ul id="navigation" class="grid_8">
	<?php wp_list_pages('depth=1&title_li=0&sort_column=menu_order'); ?>
	<li <?php if (is_home()) { echo 'class="current"';} ?>><a title="<?php bloginfo('name'); ?>"  href="<?php echo get_option('home'); ?>/">主页</a></li>
</ul>
~~~



具体如何在菜单栏显示分类，你可以看这篇文章，有什么问题再给我留言：[WordPress 分类做导航栏，并高亮显示](https://www.ludou.org/wordpress-highlight.html)

另外，可以参考这两个函数的说明(英文):

- [Template Tags/wp list pages](https://www.ludou.org/go/wl-aHR0cDovL2NvZGV4LndvcmRwcmVzcy5vcmcvVGVtcGxhdGVfVGFncy93cF9saXN0X3BhZ2Vz)
- [Template Tags/wp list categories](https://www.ludou.org/go/wl-aHR0cDovL2NvZGV4LndvcmRwcmVzcy5vcmcvVGVtcGxhdGVfVGFncy93cF9saXN0X2NhdGVnb3JpZXM)

下面两篇文章介绍了WordPress菜单的制作方法，也可以参考：

- [WordPress主题导航菜单制作的几种方法(一)](https://www.ludou.org/wordpress-create-navigation-menu.html)
- [WordPress主题导航菜单制作的几种方法(二)](https://www.ludou.org/wordpress-create-navigation-menu-by-code.html)



### 1.8 刷新缓存

在`<body>`前面，`</head>`后面添加PHP代码，用于提高程序运行效率：`<?php flush(); ?>`



## 2. footer.php

### 2.1 添加 wp_footer



### 2.2 Copyright

~~~php
Copyright &copy; <?php echo date("Y") ?> Escape Duck &nbsp;|&nbsp; All Rights Reserved
Copyright &copy; <?php echo date("Y") ?> <a href="<?php bloginfo('url'); ?>">Paretone Capital</a> &nbsp;|&nbsp; All Rights Reserved
~~~







## 3. sidebar.php

https://www.ludou.org/create-wordpress-themes-sidebar.html



~~~php
<?php 
    // Loop Columns
    for($i = 1; $i <= $footer_columns; $i++){ ?>

        <div class="col span_1_of_<?php echo $footer_columns;?>">
        <?php if ( ! dynamic_sidebar('Footer Widget '.$i) ) : ?>			
            <h3 class="widgettitle">Footer Widget Area <?php echo $i;?></h3>
                <p><a href="<?php echo admin_url('widgets.php'); ?>">Assign a widget to this area now.</a></p>	
                <?php endif; // end widget area ?>	
                    </div>

                    <?php } ?>
~~~





## 4. index.php

### 3.1 引入首尾文件

~~~php
// 引入 header 文件
<?php get_header(); ?>

// 引入侧边栏
<?php get_sidebar(); ?>
    
// 引入 footer 文件
<?php get_footer(); ?>
~~~



https://www.ludou.org/create-wordpress-themes-index.html



## 5. single.php

https://www.ludou.org/create-wordpress-themes-single.html



## 6. comment.php

https://www.ludou.org/create-wordpress-themes-comments.html



## 7. page.php

https://www.ludou.org/create-wordpress-themes-page.html



页面禁用 comment 判断

调用其他 footer 判断





# 自定义菜单

菜单 html

~~~html
<nav class="main-nav">
    <ul class="main-nav__list">
        <li class="active"><a href="<?php bloginfo('url'); ?>">Home</a></li>
        <li class=""><a href="<?php bloginfo('url'); ?>/rooms/">Rooms</a>
            <ul class="main-nav__sub">
                <li class=""><a href="<?php bloginfo('url'); ?>/sherlock-study/">Sherlock’ Study</a></li>
                <li class=""><a href="<?php bloginfo('url'); ?>/masquerade-manor/">Masquerade Manor</a></li>
                <li class=""><a href="<?php bloginfo('url'); ?>/coming-soon/">Coming Soon</a></li>

            </ul>
        </li>
        <li class=""><a href="<?php bloginfo('url'); ?>/about/">About</a></li>
        <li class=""><a href="<?php bloginfo('url'); ?>/faq/">FAQ</a></li>
        <li class=""><a href="<?php bloginfo('url'); ?>/contact/">Contact</a></li>
    </ul>

</nav>
~~~





function.php 中添加

~~~php
if(function_exists('register_nav_menus')){
    register_nav_menus( array(
        'header_menu' => __( 'topnav' )		// 定义顶部菜单名称
        'footer_menu' => 'Footer Menu'	// 定义底部菜单名称
    ) );
}
~~~



主题模板中添加

~~~php
<?php wp_nav_menu( array( 'theme_location' => 'header_menu' )); ?>
~~~



wp_nav_menu 可以传递一个数组，

~~~
<?php $defaults = array(
	'theme_location'  => 'header_menu',
	'menu'            => '',
	'container'       => 'div',								// 最外层标签，默认 div
	'container_class' => 'menu-{menu slug}-container',		// 最外层标签类
	'container_id'    => '',								// 最外层标签id
	'menu_class'      => 'menu',							// ul 类名
	'menu_id'         => '',								// ul id
	'echo'            => true,
	'fallback_cb'     => 'wp_page_menu',
	'before'          => '',
	'after'           => '',
	'link_before'     => '',
	'link_after'      => '',
	'items_wrap'      => '<ul id="%1$s">%3$s</ul>',
	'depth'           => 0,
	'walker'          => ''
); ?>

<?php wp_nav_menu( $defaults ); ?>
~~~

> 不需要的不要传空值



mainmenu 改 ul 类名

~~~php
function add_id_and_classes_to_page_menu($ulclass) {
    return preg_replace('/<ul>/', '<ul class="main-nav__list">', $ulclass, 1);
}
add_filter('wp_page_menu', 'add_id_and_classes_to_page_menu');
~~~



submenu 改 ul 类名

~~~php
function new_submenu_class($menu) {
    $menu = preg_replace('/ class="sub-menu"/', '/ class="main-nav__sub" /', $menu);
    return $menu;
}

add_filter('wp_nav_menu', 'new_submenu_class');
~~~









https://m.wpjam.com/article/wp-nav-menu/



# 插件

- Slider Revolution
- WPBakery
- 404
- Polylang
- WP Super Cache



# 检查版权

- 搜索模板所有关键字



# 速查 API

~~~
WordPress基本模板文件

style.css : CSS(样式表)文件
index.php : 主页模板
archive.php : Archive/Category模板
404.php : 404页面，错误页模板
comments.php : 留言/回复模板
footer.php : Footer模板
header.php : Header模板
sidebar.php : 侧栏模板
page.php : 内容页(Page)模板
single.php : 内容页(Post)模板
searchform.php : 搜索表单模板
search.php : 搜索结果模板





基本条件判断Tag

is_home() : 是否为主页
is_single() : 是否为内容页(Post)
is_page() : 是否为内容页(Page)
is_category() : 是否为Category/Archive页
is_tag() : 是否为Tag存档页
is_date() : 是否为指定日期存档页
is_year() : 是否为指定年份存档页
is_month() : 是否为指定月份存档页
is_day() : 是否为指定日存档页
is_time() : 是否为指定时间存档页
is_archive() : 是否为存档页
is_search() : 是否为搜索结果页
is_404() : 是否为 “HTTP 404: Not Found” 错误页
is_paged() : 主页/Category/Archive页是否以多页显示

Header部分常用到的PHP函数

<?php bloginfo(’name’); ?> : 博客名称(Title)
<?php bloginfo(’stylesheet_url’); ?> : CSS文件路径
<?php bloginfo(’pingback_url’); ?> : PingBack Url
<?php bloginfo(’template_url’); ?> : 模板文件路径
<?php bloginfo(’version’); ?> : WordPress版本
<?php bloginfo(’atom_url’); ?> : Atom Url
<?php bloginfo(’rss2_url’); ?> : RSS 2.o Url
<?php bloginfo(’url’); ?> : 博客 Url
<?php bloginfo(’html_type’); ?> : 博客网页Html类型
<?php bloginfo(’charset’); ?> : 博客网页编码
<?php bloginfo(’description’); ?> : 博客描述
<?php wp_title(); ?> : 特定内容页(Post/Page)的标题

模板常用的PHP函数及命令

<?php get_header(); ?> : 调用Header模板
<?php get_sidebar(); ?> : 调用Sidebar模板
<?php get_footer(); ?> : 调用Footer模板
<?php the_content(); ?> : 显示内容(Post/Page)
<?php if(have_posts()) : ?> : 检查是否存在Post/Page
<?php while(have_posts()) : the_post(); ?> : 如果存在Post/Page则予以显示
<?php endwhile; ?> : While 结束
<?php endif; ?> : If 结束
<?php the_time(’字符串’) ?> : 显示时间，时间格式由“字符串”参数决定，具体参考PHP手册
<?php comments_popup_link(); ?> : 正文中的留言链接。如果使用 comments_popup_script() ，则留言会在新窗口中打开，反之，则在当前窗口打开
<?php the_title(); ?> : 内容页(Post/Page)标题
<?php the_permalink() ?> : 内容页(Post/Page) Url
<?php the_category(’, ‘) ?> : 特定内容页(Post/Page)所属Category
<?php the_author(); ?> : 作者
<?php the_ID(); ?> : 特定内容页(Post/Page) ID
<?php edit_post_link(); ?> : 如果用户已登录并具有权限，显示编辑链接
<?php get_links_list(); ?> : 显示Blogroll中的链接
<?php comments_template(); ?> : 调用留言/回复模板
<?php wp_list_pages(); ?> : 显示Page列表
<?php wp_list_categories(); ?> : 显示Categories列表
<?php next_post_link(’ %link ‘); ?> : 下一篇文章链接
<?php previous_post_link(’%link’); ?> : 上一篇文章链接
<?php get_calendar(); ?> : 日历
<?php wp_get_archives() ?> : 显示内容存档
<?php posts_nav_link(); ?> : 导航，显示上一篇/下一篇文章链接
<?php include(TEMPLATEPATH . ‘/文件名’); ?> : 嵌入其他文件，可为定制的模板或其他类型文件

与模板相关的其他函数

<?php _e(’Message’); ?> : 输出相应信息

<?php wp_register(); ?> : 显示注册链接

<?php wp_loginout(); ?> : 显示登录/注销链接

<!–next page–> : 将当前内容分页

<!–more–> : 将当前内容截断，以不在主页/目录页显示全部内容

<?php timer_stop(1); ?> : 网页加载时间(秒)

<?php echo get_num_queries(); ?> : 网页加载查询量
~~~

