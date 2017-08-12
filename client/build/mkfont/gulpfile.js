

function listAll() {
    return th2.obj(function througn(file, encoding, callback) {
        console.log(file.path + ++i);
        return callback(null, file);
    });
}

gulp.task('default', function() {
    gulp.src('/Users/sky/work/kr-data/src/svgs/*.svg')
        .pipe(listAll())
})
