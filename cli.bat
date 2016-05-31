echo json_url dest_filename
node src\tools\cli src\tools\mag_template.js %1 __temp.jsx
echo conv to jsx to js
babel --presets react __temp.jsx -o %2
rem del __temp.jsx