<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Simulations</title>
    <!-- <link rel="shortcut icon" href="favicon.ico" /> -->
    <link rel="stylesheet" type="text/css" href="css/line-awesome.css" />
    <link rel="stylesheet" type="text/css" href="css/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="libs/mCustomScrollbar/jquery.mCustomScrollbar.css" />
    <link rel="stylesheet" type="text/css" href="sass/shell.css" />
</head>

<body onload="">
    <!--initialLaunch -->
    <!--div id="splashContainer" class="ShellOverlay"> <div class="comonTable"> <div class="comonTableCell"> <div class="Intro_button" id="initLaunchBtn"> <img src="./images/shell/launch_btn.png" alt="launch"> </div> <p class="intro_txt" id="intro_txt">
			Click the icon to launch the course. </p> </div> </div> </div-->
    <!--//initialLaunch -->
    <div id="f_wrapper">
        <!-- preloader start -->
        <div id="f_preloader_wrapper">
           <div class="f_loaderImage" id="f_pageLoaderImg">
                        <div class='loading'>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <svg viewBox="0 0 180 180" class="loading-text" width="180" height="180">
                                <defs>
                                    <path id="circlePath" d="M90,90 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
                                </defs>
                                <text fill="#195855" font-size="15" font-family="cursive" letter-spacing="2">
                                    <textPath href="#circlePath" startOffset="0%">
                                        LOADING ••••••••••••••••LOADING ••••••••••••••••••••
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>
        </div>
        <!-- preloader end -->
        <!-- preloade image start -->
        <div id="f_preload_main_images">
            <img id="preload1" src="./assets/images/Main_BG.png" alt="preloadImage" />
            <img id="preload2" src="./assets/images/intro_bg.png" alt="preloadImage" />
            <img id="preload3" src="./assets/images/preload_sprites.png" alt="preloadImage" />
        </div>
        <!-- preloade image end -->
        <!-- start course -->
        <div id="f_start_course">
            <div id="f_header_main">
                 <!--  <div class="copyright">
                    <p>Copyright © 2026 Macmillan Education India Private Limited. All rights reserved.</p>
                </div> -->
                  <div id="f_companyLogo_main">
                <img tabindex="-1" alt="e y logo" src="./assets/images/logo.png" />
            </div> 
            </div>
            <div id="intro">
                <div id="intro-text">
                    <div id="intro-header">
                        <div class="left-char"></div>
                        <div class="intro-text-content">
                      
								 <h1 tabindex="-1" aria-label="Course Title goes here">
                                <span class="shape-1">MATHS</span> <span class="shape-2">SIMULATION</span>
                            </h1>
                        <div id="Ip1">
                            <p tabindex="0"> Area & Perimeter </p>
                        </div>
                        <!--  <div id="Ip2">
								<p tabindex='-1' class="i-text">This course contains audio. To optimize your learning
								    experience, adjust the volume to a suitable level now.</p>
								    <p aria-label="Select Start to begin." tabindex='-1'>Select Start to begin.</p>
								</div> -->
                        <div id="intro-button">
                            <button type="button" id="f_launchBtn"></button>
                        </div>
                        </div>
                        <!--<p  tabindex='0' id="p2"></p>-->
                        <div class="right-char"></div>
                    </div>
                </div>
            </div>
              <audio id='audio_src' loop>
					<!-- <source src="./assets/audios/BG.mp3" type='audio/mpeg'> -->
					</audio>
                    <audio id="simulationAudio">
                        <source src="" type="audio/mpeg">
                    </audio>
            <!--  <div class='btn_container'>
					<button aria-label='Please click the arrow button to launch the course.' class='playButton'>
					    <label class='play-inst' aria-label='Please click the arrow button to launch the course.'>Please click the arrow button to <br>launch the course.
					    </label>
					    <div class='btnImg'></div>
					</button>
					</div> -->
            <!--<div id="course_title_holder">
					<div id="int_heading_patch" tabindex="0" role="heading" aria-level="1">
					   <h1></h1>
					</div>
					<button type="button" id="f_startCourseBtn"></button>
					<div id="int_heading_blue">
					</div>
					
					</div>-->
        </div>
        <!-- start end -->
        <!-- 
				<div id="helpVideoHolder">
				   <div class="helpVidContent">
				      <video id="helpVideo" src="./assets/videos/help.mp4" preload="auto" playsinline></video>
				      <button type="button" id="skipHelpBtn">Skip</button>
				      <div id="helpVideoPlayer">
				         <button type="button" id="helpPlayBtn" class="helpPause" title="Play Pause"></button>
				         <div id="helpProgress">
				            <div id="helpProgressBar"></div>
				         </div>
				         <button type="button" id="helpReplayBtn" title="Replay"></button>
				      </div>
				   </div>
				</div>
				-->
        <div class="hideMain">
            <!-- header start -->
            <div id="f_header">
                <div id="f_companyLogo">
                    <div class="logo-bg-patch">
                        <img tabindex="0" alt="e y logo" src="./assets/images/logo.png" />
                    </div>
                </div>
                <div id="f_courseTitle">
                    <p tabindex="0"></p>
                </div>
            </div>
            <!-- header end -->
            <!-- content start -->
            <section id="f_content">
                <div id="f_pageLoader"></div>
               
                <!-- <div id="f_screenTitle">
						<p></p>
						</div> -->
                <!-- ccText start -->
                <div id="f_ccContainer">
                    <div id="f_ccText">
                        <p></p>
                    </div>
                </div>
                <!-- ccText end -->
                <!-- preloader start -->
                <div id="f_preloader_page">
                    <div class="f_loaderImage" id="f_pageLoaderImg">
                        <div class='loading'>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <div class='ball'></div>
                            <svg viewBox="0 0 180 180" class="loading-text" width="180" height="180">
                                <defs>
                                    <path id="circlePath" d="M90,90 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
                                </defs>
                                <text fill="white" font-size="15" font-family="cursive" letter-spacing="2">
                                    <textPath href="#circlePath" startOffset="0%">
                                        LOADING ••••••••••••••••LOADING ••••••••••••••••••••
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- menu end -->
                <!-- transcript start <div id="f_transcriptPopup">-->
                <div id="f_transcriptContainer">
                    <div id="f_transHeader">
                        <p id="f_transTitle" aria-label="TRANSCRIPT" tabindex="0">
                            Transcript
                        </p>
                    </div>
                    <div class="clearFix"></div>
                    <div id="f_transContent">
                        <div id="f_transText"></div>
                    </div>
                    <button type="button" id="f_transClose" aria-label="close" tabindex="0" class="la la-times"></button>
                </div>
                <!--</div> transcript end -->
            </section>
            <!-- content end -->
            <!-- menu start -->
            <div id="f_menuPopup">
                <div id="f_menuContainer">
                    <div id="f_menuHeader">
                        <div id="f_menuTitle" tabindex="0">Menu</div>
                    </div>
                    <div id="f_menuContent"></div>

                    <div id="f_menuFooter">
                        <button type="button" id="f_menuClose" class="la la-times" aria-label="close" tabindex="0"></button>
                    </div>
                </div>
            </div>
            <!-- resources start -->
            <div id="f_resourcePopup">
                <div id="f_resourceContainer">
                    <div id="f_resourceHeader">
                        <div id="f_resourceTitle" aria-label="RESOURCES" tabindex="0">
                            Resources
                        </div>
                        <!--<button type="button" id="f_resourceClose" class="la la-times
								"></button>-->
                    </div>
                    <div class="clearFix"></div>
                    <div id="f_resourceContent"></div>
                    <div id="f_resourceFooter">
                        <button type="button" id="f_resourceClose" class="la la-times" aria-label="close" tabindex="0"></button>
                    </div>
                </div>
            </div>
            <!-- resource end -->
            <!-- refrence start -->
            <!-- refrence end -->
            <!-- glossary start -->
            <div id="f_glossaryPopup">
                <div id="f_glossaryContainer">
                    <div id="f_glossaryHeader">
                        <div id="f_glossaryTitle" aria-label="glossary" tabindex="0">
                            Glossary
                        </div>
                    </div>
                    <div class="clearFix"></div>
                    <div id="f_glossaryContent"></div>
                    <!--   <div id="glossaryIndicator">
                        <button id="glossaryPrev" title="Prev"></button>
                        <button id="glossaryNext" title="Next"></button>
                    </div> -->
                    <div id="f_glossaryFooter">
                        <button type="button" id="f_glossaryClose" class="la la-times" aria-label="close" tabindex="0"></button>
                    </div>
                    <!--<div id="f_glossaryHeader">
							<div id="f_glossaryTitle">GLOSSARY</div>
							<button type="button" id="f_glossaryClose" class="la la-times
							"></button>
							</div>
							<div class="clearFix"></div>
							<div id="f_glossaryContent">
							<div id="f_glossaryCol1"></div>
							<div id="f_glossaryCol2"></div>
							<div id="f_glossaryCol3">
							   <div id="f_g_heading"></div>
							   <div id="f_g_description"></div>
							</div>
							</div>-->
                </div>
            </div>
            <!-- glossary end -->
            <div id="f_helpPopup">
                <div id="f_helpContainer">
                    <div id="f_helpHeader">
                        <div id="f_helpTitle" tabindex="0">Help</div>
                    </div>
                    <div class="clearFix"></div>
                    <div id="f_helpContent">
                        <div id="help_text">
                            <div class="container" style="display: block; opacity: 1">
                                <div class="contentWrap">
                                    <div class="textCol1">
                                        <div class="contentData">
                                            <div class="img menu_m">
                                                <p>Menu</p>
                                            </div>
                                            <p aria-label="This displays the list of topics within the course" tabindex="0" style="display: block; opacity: 1">
                                                This displays the list of topics within the course
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m">
                                                <p>Resources</p>
                                            </div>
                                            <p aria-label="The Menu icon helps you access lessons in the module. " tabindex="0" style="display: block; opacity: 1">
                                                Allows you to view any supporting learning materials for this course
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m">
                                                <p>Glossary</p>
                                            </div>
                                            <p aria-label="Displays the glossary, which can be used to view the definitions of commonly used terms in the course" tabindex="0" style="display: block; opacity: 1">
                                                Displays the glossary, which can be used to view the definitions of commonly used terms in the course
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m">
                                                <p>Help</p>
                                            </div>
                                            <p aria-label="The help button shows you how to navigate this module" tabindex="0" style="display: block; opacity: 1">
                                                The help button shows you how to navigate this module
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m">
                                                <p>CC</p>
                                            </div>
                                            <p aria-label="Displays the closed caption text for audio" tabindex="0" style="display: block; opacity: 1">
                                                Displays the closed caption text for audio
                                            </p>
                                        </div>

                                    </div>
                                    <div class="textCol2">
                                        <div class="contentData">
                                            <div class="img menu_m1">
                                                <img src="assets/images/ui/help/gadgetBtn_nomal.png" alt="Play Pause Replay" />
                                            </div>
                                            <p aria-label="This displays options to navigate various elements of the course." tabindex="0" style="display: block; opacity: 1">
                                                This displays options to navigate various elements of the course
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m1">
                                                <img src="assets/images/ui/help/number.png" alt="Replay" />
                                            </div>
                                            <p aria-label="Displays the current screen number" tabindex="0" style="display: block; opacity: 1">
                                                Displays the current screen number
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m1 iconSizenext">
                                                <img src="assets/images/ui/help/Prev_Next.png" alt="Next Button" />
                                            </div>
                                            <p aria-label="Allows you to go to the next page in this course by clicking on next button and to go to previous page by clicking on previous button" tabindex="0" style="display: block; opacity: 1">
                                                Allows you to go to the next page in this course by clicking on “>” and to go to previous page by clicking on “
                                                <” </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m1 iconSize">
                                                <img src="assets/images/ui/help/player_function.png" alt="Play and pause" />
                                            </div>
                                            <p aria-label="Play, pause and replay the screen" tabindex="0">
                                                Play, pause and replay the screen
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m1 iconSize">
                                                <img src="assets/images/ui/help/audio.png" alt="Mute or unmute audio" />
                                            </div>
                                            <p aria-label="Mute or unmute audio" tabindex="0">
                                                Mute or unmute audio
                                            </p>
                                        </div>
                                        <div class="contentData">
                                            <div class="img menu_m1 iconSizenext">
                                                <img src="assets/images/ui/help/close.png" alt="CC" />
                                            </div>
                                            <p aria-label="Close window and proceeds" tabindex="0">
                                                Close window and proceeds
                                            </p>
                                        </div>
                                    </div>
                                    <!-- <div class="textCol3">
											<div class="contentData">
											    <div class="img"><img src="assets/images/ui/help/zoom.png" alt="Zoom"></div>
											    <p aria-label="Click this button to enlarge the video screen." tabindex="0">Click this button to enlarge the
											        video screen.</p>
											</div>
											<div class="contentData">
											    <div class="img"><img src="assets/images/ui/help/progressbar.png" alt="Pogress"></div>
											    <p aria-label="The progress bar shows the progress of the page." tabindex="0">The Progress bar shows the
											        progress of the page.</p>
											</div>
											</div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="f_helpFooter">
                        <button aria-label="close" tabindex="0" type="button" id="f_helpClose" class="la la-times"></button>
                    </div>
                </div>
            </div>
            <!-- setting btns -->
            <div id="f_gadgetPopup">
                <!-- <button type="button" id="f_reviewBtn" class="f_navBtn" title="Review"></button> -->
                <button type="button" id="f_menuBtn" class="f_navBtn g_popup" title="Menu" tabindex="0">Menu</button>
                <button type="button" id="f_glossaryBtn" class="f_navBtn g_popup" title="Glossary" tabindex="0">Glossary</button>
                <button type="button" id="f_resourceBtn" class="f_navBtn g_popup" title="Resource" tabindex="0">Resources</button>
                <button type="button" title="Help" id="f_helpBtn" class="f_navBtn g_popup noMarginBottoms" tabindex="0">Help</button>
                <!--  <button type="button" id="f_reviewBtn" class="f_navBtn g_popup" title="Review">Review</button> -->
                <div id="f_gadgetPopupFooter">
                    <button aria-label="close" tabindex="0" type="button" id="f_gadgetPopupClose"></button>
                </div>
            </div>
            <!-- setting btns -->
            <!-- footer start-->
            <div id="f_footer">
                <div id="f_pageCounter">
                    <button type="button" id="f_nextBtn" class="f_navBtn" aria-label="Next" title="Next" aria-disabled="false" tabindex="0"></button>
                    <p id="pageCounter" aria-hidden="true" aria-label="8 of 13 pages" style="display: block; opacity: 1;"><span class="pageCount">8</span><span class="centerLine"></span><span class="totalPage">13</span></p>
                    <button type="button" id="f_backBtn" class="f_navBtn" aria-label="Previous" title="Previous" aria-disabled="false" tabindex="0"></button>
                </div>
                <button type="button" id="f_transcriptBtn" class="f_navBtn" title="Transcript" aria-label="Transcript"></button>
                <div id="f_navBtnContainer">
                    <button type="button" id="f_mediaBtn" class="f_navBtn f_play" title="Play/Pause" tabindex="0"></button>
                    <div id="roundedAudioProgress_PlayPause" style="display: none;">

                        <div class="slide__audio js-audio">
                            <div class="audio__controls">
                                <svg version="1.1" id="circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
                                    <path id="seekbar" fill="none" stroke-meterlimit="10" stroke-width="2" d="M50,2.9L50,2.9C76,2.9,97.1,24,97.1,50v0C97.1,76,76,97.1,50,97.1h0C24,97.1,2.9,76,2.9,50v0C2.9,24,24,2.9,50,2.9z" />
                                </svg>
                                <div class="audio__slider"></div>
                            </div>
                        </div>
                    </div>
                    <div id="f_progressBarContainer">
                        <div id="f_progresBarHolder">
                            <div id="f_scrubber">
                                <div id="f_progress"></div>
                            </div>
                        </div>
                        <!--    <input type="text" placeholder="GoTo Page Number" id="dummyInput" style="color: #333333; text-align: center; position: absolute; right: 590px; width: 125px; height: 32px; top: 7px;">-->
                    </div>
                    <button type="button" id="f_volumeBtn" class="f_navBtn btnColor f_unmute" title="Volume"></button>
                </div>

                <!-- <div id="f_courseTitle">
                        <p tabindex="-1"></p>
                    </div> -->
                <div class="nev_container">
                    <div id="f_nextIndicator">
                        <p>Select Next to continue.
                            <i class="nav_arrow"></i>
                        </p>
                    </div>
                </div>

                <div id="f_rightMenu">
                    <button type="button" id="f_gadgetBtn" class="f_gadgetnavBtn noMarginBottom" title="Gadget"></button>
                    <!-- <button type="button" id="f_reviewBtn" class="f_navBtn" title="Review"></button> -->

                </div>

            </div>
            <!-- footer end-->
            <!--div id="path">module/ page</div-->
            <div id="f_dummyVideoHolder" aria-hidden="true">
                <video id="courseVideo" playsinline></video>
                <div class="dummyDiv"></div>
            </div>
            <div id="resumeBlock">
                <div id="resumePopup">
                    <div class="topPatch"></div>
                    <p>Would you like to resume your course where you left off?</p>
                    <button type="button" id="restart_button">No</button>
                    <button type="button" id="resume_button">Yes</button>
                </div>
            </div>
            <audio id="courseAudio" aria-hidden="true"></audio>
            <audio id="audioLevel_1" aria-hidden="true"></audio>
            <audio id="audioLevel_2" aria-hidden="true"></audio>
            <audio id="customeAudio" aria-hidden="true"></audio>
            <audio id="landingPageAudio" aria-hidden="true"></audio>
        </div>
      
        <!-- <div id="resumePlayBlock">
				<div class="outer">
				  <button tabindex="0" id="launchPlayBtn" aria-label='Select the Launch button to view the title screen'
				    title='Launch' class='launchPlayButton launch'>
				    <p>Launch</p>
				  </button>
				</div>
				</div> -->
    </div>
    <!-- wrapper end -->
    <!-- js file -->
    <script type="text/javascript" src="./libs/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="./libs/jquery-ui.js"></script>
    <script type="text/javascript" src="./libs/jquery.ui.touch-punch.min.js"></script>
    <script type="text/javascript" src="./libs/TweenMax.min.js"></script>
    <script type="text/javascript" src="./libs/jquery.touchSwipe.js"></script>
    <script type="text/javascript" src="./libs/video.min.js"></script>
    <script type="text/javascript" src="./libs/jspdf.min.js"></script>
    <script type="text/javascript" src="./libs/roundslider.js"></script>
    <script type="text/javascript" src="./js/utils/preloader.js"></script>
    <script type="text/javascript" src="./js/utils/AnimUtils.js"></script>
    <script type="text/javascript" src="./js/utils/SpriteAnimation.js"></script>
    <script type="text/javascript" src="./js/services/Services.js"></script>
    <script type="text/javascript" src="./js/model/Model.js"></script>
    <script type="text/javascript" src="./js/controller/Contoller.js"></script>
    <script type="text/javascript" src="./js/view/MenuView.js"></script>
    <script type="text/javascript" src="./js/view/PlaybackView.js"></script>
    <script type="text/javascript" src="./js/view/GlossaryView.js"></script>
    <script type="text/javascript" src="./js/view/ResourceView.js"></script>
    <script type="text/javascript" src="./js/view/RefrenceView.js"></script>
    <script type="text/javascript" src="./js/utils/PagePreload.js"></script>
    <script type="text/javascript" src="./js/utils/DetectDevice.js"></script>
    <script type="text/javascript" src="./js/utils/tabAction.js"></script>
    <script type="text/javascript" src="./js/utils/SCORM_API_wrapper.js"></script>
    <script type="text/javascript" src="./js/utils/scormControl.js"></script>
    <script type="text/javascript" src="./libs/mCustomScrollbar/jquery.mCustomScrollbar.js"></script>
    <script src="./js/templates/js/jquery-asAccordion.js"></script>
    <!-- SCORM Init-->
    <script type="text/javascript">
        var isScorm = true;
        			var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        			if (isScorm) {
        			  pipwerks.SCORM.version = "1.2";
        			  isScorm = pipwerks.SCORM.init();
        			}
        			if (isIE11) {
        			  document.getElementById("f_wrapper").style.transformOrigin = "top left";
        			}
        			// ----------------- Resize Functionality ------------------------
        			/*	window.onload = function () {
        			          setTimeout(fnResize, 150);
        			      }
        			      window.onresize = function () {
        			          setTimeout(fnResize, 150);
        			      }
        			
        			      function fnResize() {
        			          activityScaleFn();
        			          document.getElementById("f_wrapper").style.transform = "scale( "+activityScaleX+")";
        			          if(isIE11) {
        			              $('body').css({'display':'block'})
        			              document.getElementById("f_wrapper").style.transformOrigin = "top left";
        			          }
        			          //document.getElementById("f_wrapper").style.transformOrigin = "top left";
        			      }
        			
        			      function activityScaleFn() {
        			          var winWidth = $(window).outerWidth(); //document.getElementById('f_wrapper').offsetWidth;
        			          var winHight = $(window).outerHeight();
        			          var pageWidth = 1366
        			          var pageHeight = 768
        			
        			          activityScaleX = Math.min(winWidth / pageWidth);
        			          activityScaleY = Math.min(winHight / pageHeight);
        			          if (activityScaleX > 1) {
        			              activityScaleX = 1;
        			          }
        			          if (activityScaleY > 1) {
        			              activityScaleY = 1;
        			          }
        			          scaleTo = (winWidth == pageWidth) ? activityScaleY : activityScaleX;
        			          scaleTo = (winWidth < pageWidth) ? activityScaleX : activityScaleY;
        			          scaleTo = (winWidth > pageHeight) ? activityScaleY : activityScaleX;
        			          //console.log("winWidth::: ", winWidth, $("#f_wrapper").outerWidth());
        			          //console.log(' >>>  	',activityScaleY, scaleTo)
        			      }*/
        			//-----------------
    </script>
    <script type="text/javascript" src="./js/templates/js/page_plugin.js"></script>
    <script type="text/javascript" src="./js/templates/js/popup.js"></script>
    <script type="text/javascript" src="./js/Main.js"></script>
</body>

</html>