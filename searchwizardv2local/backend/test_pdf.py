#!/usr/bin/env python3
"""
Quick test to verify PDF generation works
"""

def test_pdf_generation():
    try:
        import weasyprint
        
        # Test HTML with print styling
        test_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @page {
                    size: Letter;
                    margin: 0.75in;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                h1 {
                    color: #2563eb;
                    border-bottom: 2px solid #2563eb;
                    padding-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <h1>PDF Generation Test</h1>
            <p>This is a test document to verify that PDF generation is working correctly.</p>
            <p>If you can see this as a PDF, then WeasyPrint is installed and functioning properly!</p>
        </body>
        </html>
        """
        
        # Generate PDF
        pdf_bytes = weasyprint.HTML(string=test_html).write_pdf()
        
        # Save test PDF
        with open('test_output.pdf', 'wb') as f:
            f.write(pdf_bytes)
        
        print("✅ PDF generation test successful!")
        print(f"✅ Generated test_output.pdf ({len(pdf_bytes)} bytes)")
        print("✅ WeasyPrint is working correctly")
        return True
        
    except ImportError:
        print("❌ WeasyPrint not installed")
        print("Run: pip install weasyprint")
        return False
    except Exception as e:
        print(f"❌ PDF generation failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_pdf_generation()