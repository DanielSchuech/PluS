var config = require('../config');
var gulp = require('gulp');

gulp.task('watch', function () {

  gulp.watch([config.scripts.src, config.views.src], ['transform']);
  gulp.watch(config.styles.watch,  ['styles']);
  gulp.watch(config.images.src,  ['images']);
  gulp.watch(config.views.watch, ['views']);
  gulp.watch(config.translations.src, ['translations']);
  gulp.watch(config.pluginSystem.src,  ['server:restart']);
  gulp.watch('node_modules/PluS*/*',  ['server:restart']);
});