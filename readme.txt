Project Root
===============================================================================
    This is the root of the client application. 

    The client application is written entirely in HTML, CSS and JavaScript, 
and exists entirely as a single web page. These aspects allow very high
portability client code implementations, supporting potential 
adaptations to other platform such as smartphone apps.

    Read below for a quick outline of the structure of the 
documentation within this project and some general information about the 
project.

    Project Documentation
    ===========================================================================
        Most major directories will have a readme.txt file, just like this one.
    These files exist to give you an overview of the purpose of that directory,
    and the type of files it contains.

        If a directory does not contain a readme.txt, the likely explanation is
    that it's purpose was deemed self-evident, and further details may be found 
    in the files themselves. If a directory contains a single file, a 
    readme.txt will likely not exist in favour of documenting only that file.


        When file paths are provided, they may be assumed to be relative to the
    directory of the readme.txt file, unless otherwise indicated by the
    inclusion of parent directories.

        Finally, every readme.txt file should contain brief descriptions of any
    direct child directories, demonstrated at the end of this file.

        So, good luck and if you're lost, remember to look for the readme.txt.

    Framework
    ===========================================================================
        The client application has been developed using a custom JavaScript 
    framework. This framework is quite limited in overall functionality, 
    and exists primarily to support a more modular and structured approach
    to writing code in JavaScript.

        For reference: https://github.com/DWMiller/custom_js_framework

    Notable Tools Utilized
    ===========================================================================

            SASS: SASS (http://sass-lang.com) is a CSS pre-processing language, 
        allowing CSS to be written more like a programming language.
    
            Grunt: Grunt (http://gruntjs.com/) is an automated task manager 
        developed in nodeJS. It’s potential usage and even it’s implementation 
        in this project rather extensive, but in simplest terms I am using it 
        as a compiler.

    Deployment
    ===========================================================================


    Subdirectories
    ===========================================================================
     
        assets
        =======================================================================  
            This directory contains all images used in the project

        dist
        ======================================================================= 
            This is the production directory, created programatically by Grunt. 
        The files in this directory are the ones utilized when viewing the site.
        These files should not be altered manually. 

        grunt
        ======================================================================= 
            This directory contains the tasks to be executed by Grunt in the 
        compilation process which creates the files in the dist directory. 
        These files will not be documented within this project.

        js
        =======================================================================    
           This directory contains all JavaScript files utilized in this
        application, and is thus where most functionality may be found.

        Sass
        =======================================================================    
            This directory contains all the SASS files for the project. These
        files are generally similar enough to standard CSS to be read as such.                  