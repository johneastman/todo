mipmap_files=("mipmap-anydpi-v26" "mipmap-hdpi" "mipmap-ldpi" "mipmap-mdpi" "mipmap-xhdpi" "mipmap-xxhdpi" "mipmap-xxxhdpi" "values");

# Replace icon
for mipmap in "${mipmap_files[@]}";
do
    cp -r "assets/icons/android/$mipmap/" "android/app/src/main/res/$mipmap/"
done;

# Replace splash screen
drawable_files=("drawable-hdpi" "drawable-mdpi" "drawable-xhdpi" "drawable-xxhdpi" "drawable-xxxhdpi");
for drawable in "${drawable_files[@]}";
do
    cp -r "assets/icons/android/splashscreen_image.png" "android/app/src/main/res/$drawable/splashscreen_image.png";
done
