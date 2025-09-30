# New Features Guide - AVS Attendance Management System

## 📸 Photo Upload Feature

### Overview
Students can now have profile photos uploaded and stored locally. The system includes intelligent image compression and validation.

### How to Use:
1. **Adding Photos**: When adding or editing a student, click the "Choose Photo" button
2. **Supported Formats**: JPEG, PNG, GIF, WebP (max 5MB)
3. **Auto-Compression**: Images are automatically compressed to 800px max width for optimal performance
4. **Preview**: Real-time preview shows before saving
5. **Remove Photos**: Click the "X" button on the photo to remove it

### Technical Details:
- Images are stored as base64 in localStorage
- Automatic compression reduces file size by ~80%
- Client-side validation prevents invalid uploads
- Fallback avatars show initials when no photo is available

---

## 🕐 Automatic Session Management

### Overview
Enhanced security with automatic logout after inactivity periods, protecting sensitive attendance data.

### Session Features:

#### ⏰ **Session Duration**
- **Total Session**: 30 minutes of inactivity
- **Warning Period**: 5 minutes before auto-logout
- **Activity Tracking**: Mouse movements, clicks, keyboard input, scrolling

#### 🚨 **Session Warnings**
- Warning popup appears 5 minutes before logout
- Live countdown shows remaining time
- Options to "Continue Session" or "Logout Now"

#### 🔄 **Session Extension**
- Any user activity automatically resets the timer
- Manual "Continue Session" button extends time
- Toast notifications confirm session extensions

#### 🔐 **Auto-Logout**
- Automatic logout when session expires
- All session data cleared from localStorage
- Redirects to login page with expiry notification

### Security Benefits:
- Prevents unauthorized access on shared computers
- Protects student data from being left exposed
- Complies with educational data protection standards
- Provides clear user feedback about session status

---

## 🛡️ Additional Security Features

### Session Status Indicator
- Live "Session Active" indicator in header
- Green pulse animation shows active session
- User greeting with current logged-in staff name

### Data Protection
- All student photos stored locally (no external servers)
- Session timeouts prevent data exposure
- Clear logout process removes all stored session data

---

## 📱 Mobile Optimizations

### Photo Upload on Mobile
- Touch-friendly upload interface
- Responsive photo preview
- Mobile camera integration (where supported)
- Optimized for various screen sizes

### Session Management on Mobile
- Mobile-optimized warning dialogs
- Touch-friendly session controls
- Proper viewport handling for session alerts

---

## 🎯 Best Practices

### For Photo Management:
1. **Image Quality**: Use clear, well-lit photos for better recognition
2. **File Size**: Keep original files under 5MB for faster uploads
3. **Format**: JPEG recommended for smaller file sizes
4. **Backup**: Consider backing up student data periodically

### For Session Security:
1. **Regular Activity**: Stay active when using the system
2. **Manual Logout**: Always logout when finished, especially on shared devices
3. **Session Awareness**: Pay attention to session warnings
4. **Data Protection**: Don't leave the system unattended

---

## 🔧 Technical Specifications

### Photo Upload:
- **Compression**: 80% quality, 800px max width
- **Storage**: Base64 encoded in browser localStorage
- **Validation**: File type, size, and format checking
- **Performance**: Optimized for mobile and desktop

### Session Management:
- **Timer**: 30-minute rolling window
- **Events**: mousedown, mousemove, keypress, scroll, touchstart, click
- **Storage**: Session data in localStorage
- **Cleanup**: Automatic timer cleanup on logout

---

## 🆘 Troubleshooting

### Photo Upload Issues:
- **File too large**: Compress image or choose smaller file
- **Format not supported**: Use JPEG, PNG, GIF, or WebP
- **Upload fails**: Check file permissions and try again

### Session Issues:
- **Unexpected logout**: Check for network interruptions
- **Warning not showing**: Ensure browser notifications are enabled
- **Session not extending**: Try manual refresh or re-login

---

*For technical support or feature requests, contact the development team.*