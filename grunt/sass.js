module.exports = {
        sass: { 
        	options: {
        		style: 'compressed'
        	},                            // target
            files: {                        // dictionary of files
                'build/css/production.css': 'app/src/core/main.scss'     // 'destination': 'source'
            }
        }  
}
