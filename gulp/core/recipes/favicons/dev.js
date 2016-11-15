var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var favicons     = require('gulp-favicons');
var filter       = require('gulp-filter');
var replace      = require('gulp-replace-task');
var rename       = require('gulp-rename');
var browserSync  = require('browser-sync');

// utils
var pumped       = require('../../utils/pumped');

// config
var config       = require('../../config/favicons');


/**
 * Generate Favicons
 * copy them to
 * the built theme
 * along with html include file
 * renamed to .php
 * for get_template_part
 * inclusion in header.php
 *
 */
module.exports = function () {
	var filterHTML  = filter('**/*.html', { restore: true });

	return gulp.src(config.paths.src)
		.pipe(plumber())

		.pipe(favicons(config.options))
		.pipe(filterHTML) // Filter html file and
		.pipe(replace({   // Remove apple-webapp-capable,
			patterns: [   // see https://github.com/haydenbleasel/favicons/issues/157
				{
					match: /<meta name="apple-mobile-web-app.*\n/g,
      				replacement: ''
				}
			]
		}))
		.pipe(rename(function (path) { // change its extension to php
  		  path.extname = ".php";
  		  return path;
  		}))
		.pipe(filterHTML.restore)
		.pipe(gulp.dest(config.paths.dest))
		.pipe(notify({
			message: pumped('Favicons Generated'),
			onLast: true
		}))

		.on('end', browserSync.reload);
};