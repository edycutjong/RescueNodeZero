import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "assets")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_demo():
    print("🚀 Starting demo capture for RescueNode Zero...")
    
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        
        # Create a new browser context with video recording enabled
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=OUTPUT_DIR,
            record_video_size={"width": 1920, "height": 1080}
        )
        
        page = context.new_page()
        
        print("🌐 Navigating to http://localhost:3000 ...")
        # Ensure your RescueNode Zero app is running!
        try:
            page.goto("http://localhost:3000", wait_until="networkidle")
        except Exception as e:
            print("❌ Cannot connect to localhost:3000. Make sure to run 'make docker-up' first!")
            return
            
        time.sleep(2)
        
        # Take a high-quality screenshot
        screenshot_path = os.path.join(OUTPUT_DIR, "dashboard_screenshot.png")
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"📸 Screenshot saved to: {screenshot_path}")
        
        print("🎬 Simulating user interactions for recording...")
        
        # Add your specific interactions here if you want:
        # e.g., page.fill('input[type="text"]', 'CHEMICAL SPILL')
        
        time.sleep(4) # Record for 4 seconds
        
        # Close the context to finalize the video
        context.close()
        browser.close()
        
        # Rename the random webm file to demo_recording.webm
        for file in os.listdir(OUTPUT_DIR):
            if file.endswith(".webm") and file != "demo_recording.webm":
                latest_video_path = os.path.join(OUTPUT_DIR, file)
                final_video_path = os.path.join(OUTPUT_DIR, "demo_recording.webm")
                
                if os.path.exists(final_video_path):
                    os.remove(final_video_path)
                
                os.rename(latest_video_path, final_video_path)
                print(f"🎥 Video recording saved to: {final_video_path}")
                break

if __name__ == "__main__":
    capture_demo()
    print("✅ Demo capture complete!")
