"""
GeoWatch Notifications
Author: Ram
Description: Email notification service for GeoWatch platform.
"""

from dotenv import load_dotenv
load_dotenv()
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from utils import generate_thumbnail, format_area

# GeoWatch Notification Configuration
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', "geowatch-alerts@example.com") 

def send_change_alert_email(user_email: str, aoi_name: str, change_details: dict):
    """
    Send a GeoWatch branded email alert for detected changes.
    """
    if not SENDGRID_API_KEY:
        print("⚠️ GeoWatch Warning: SendGrid API Key not configured. Skipping email alert.")
        return

    # Prepare parameters for thumbnail generation
    for key in ["before_image_params", "after_image_params"]:
        if key in change_details:
            params = change_details[key]
            # Ensure vis_params are correct for visualization
            if "vis_params" not in params:
                params["vis_params"] = {"bands": ["B4", "B3", "B2"], "min": 0.0, "max": 0.3}
    
    try:
        # Generate thumbnails
        before_url = generate_thumbnail(change_details["before_image_params"])
        after_url = generate_thumbnail(change_details["after_image_params"])
        
        area_str = format_area(change_details['area_of_change'])
        
        message = Mail(
            from_email=SENDER_EMAIL,
            to_emails=user_email,
            subject=f"🌍 GeoWatch Alert: Change Detected in {aoi_name}",
            html_content=f"""
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 24px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">GeoWatch</h1>
                    <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Monitor Earth. Detect Change. Act Smart.</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 24px; background-color: white;">
                    <h2 style="color: #1e293b; margin-top: 0;">Change Alert Detected</h2>
                    <p style="color: #475569; line-height: 1.6;">
                        GeoWatch has detected a significant change in your monitoring zone <strong>{aoi_name}</strong>.
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 16px;">Analysis Details:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #475569;">
                            <li style="margin-bottom: 8px;"><strong>Change Severity:</strong> <span style="color: #d97706; font-weight: 600;">{change_details.get('severity', 'Moderate').title()}</span></li>
                            <li style="margin-bottom: 8px;"><strong>Area Affected:</strong> {area_str}</li>
                            <li><strong>Detection Date:</strong> {change_details.get('detection_date').strftime('%B %d, %Y')}</li>
                        </ul>
                    </div>
                    
                    <h3 style="color: #334155; font-size: 16px; margin-bottom: 16px;">Satellite Imagery Comparison:</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <tr>
                            <td style="width: 50%; padding-right: 8px; vertical-align: top;">
                                <div style="margin-bottom: 8px; font-weight: 600; color: #64748b; font-size: 14px;">Before</div>
                                <img src="{before_url}" alt="Before" style="width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; display: block;">
                            </td>
                            <td style="width: 50%; padding-left: 8px; vertical-align: top;">
                                <div style="margin-bottom: 8px; font-weight: 600; color: #64748b; font-size: 14px;">After</div>
                                <img src="{after_url}" alt="After" style="width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; display: block;">
                            </td>
                        </tr>
                    </table>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/dashboard" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; transition: background-color 0.2s;">View Analysis on Dashboard</a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        © 2026 GeoWatch. Built by Ram.<br>
                        Automatic Alert System
                    </p>
                </div>
            </div>
            """
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ GeoWatch: Alert email sent to {user_email} (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ GeoWatch Notification Error: {str(e)}")