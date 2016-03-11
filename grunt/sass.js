module.exports = {
        sass: { 
        	options: {
        		style: 'compressed'
        	},                            // target
            files: {                        // dictionary of files
                'dist/css/production.css': 'src/sass/main.scss'     // 'destination': 'source'
            }
        }  
}
