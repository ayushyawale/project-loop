const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { marked } = require('marked');

// Load files
const mdPath = path.join(__dirname, 'PROJECT_REPORT.md');
const pdfPath = path.join(__dirname, 'PROJECT_REPORT.pdf');

if (!fs.existsSync(mdPath)) {
  console.error(`Error: PROJECT_REPORT.md not found at ${mdPath}`);
  process.exit(1);
}

const markdownContent = fs.readFileSync(mdPath, 'utf8');

// Initialize PDF Document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 60, left: 50, right: 50 },
  bufferPages: true // Enable buffering to count total pages for footers
});

// Stream PDF to file
const writeStream = fs.createWriteStream(pdfPath);
doc.pipe(writeStream);

// Styles configuration
const styles = {
  primaryColor: '#8b5cf6', // Violet
  darkColor: '#0f172a',    // Slate 900
  lightBg: '#f8fafc',      // Slate 50
  borderColor: '#cbd5e1',  // Slate 300
  textColor: '#334155',    // Slate 700
  codeColor: '#0f172a',
  codeBg: '#f1f5f9',
  fontSize: {
    title: 26,
    subtitle: 14,
    h1: 18,
    h2: 14,
    h3: 12,
    body: 10,
    small: 8
  },
  lineGap: 4
};

// Write Cover Page
function writeCoverPage() {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a'); // Dark cover background
  
  // Decorative geometric element
  doc.fillColor('#8b5cf6').opacity(0.15);
  doc.polygon([0, 0], [doc.page.width, 0], [doc.page.width, doc.page.height * 0.45], [0, doc.page.height * 0.3]);
  doc.fill();
  doc.opacity(1);

  // Title info
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(32)
     .text('PROJECT LOOP', 50, doc.page.height * 0.35, { align: 'left' });

  doc.fillColor('#a78bfa')
     .font('Helvetica')
     .fontSize(styles.fontSize.subtitle + 4)
     .text('AI Customer-Feedback Intelligence Platform', 50, doc.page.height * 0.42, { align: 'left' });

  doc.fillColor('#94a3b8')
     .fontSize(styles.fontSize.body + 2)
     .text('Zidio Development Internship — Final Submission Report', 50, doc.page.height * 0.47, { align: 'left' });

  // Divider
  doc.strokeColor('#334155')
     .lineWidth(1)
     .moveTo(50, doc.page.height * 0.55)
     .lineTo(doc.page.width - 50, doc.page.height * 0.55)
     .stroke();

  // Submission info
  doc.fillColor('#cbd5e1')
     .font('Helvetica-Bold')
     .fontSize(styles.fontSize.body + 1)
     .text('Author / Intern:', 50, doc.page.height * 0.65);
     
  doc.font('Helvetica')
     .text('Ayush Yawale (ayushyawale30@gmail.com)', 160, doc.page.height * 0.65);

  doc.font('Helvetica-Bold')
     .text('GitHub Repository:', 50, doc.page.height * 0.70);
  
  doc.font('Helvetica')
     .fillColor('#8b5cf6')
     .text('https://github.com/ayushyawale/project-loop', 160, doc.page.height * 0.70, {
       link: 'https://github.com/ayushyawale/project-loop',
       underline: true
     });

  doc.fillColor('#cbd5e1')
     .font('Helvetica-Bold')
     .text('Deployment URL:', 50, doc.page.height * 0.75);

  doc.font('Helvetica')
     .fillColor('#8b5cf6')
     .text('https://project-loop-demo.vercel.app', 160, doc.page.height * 0.75, {
       link: 'https://project-loop-demo.vercel.app',
       underline: true
     });

  doc.fillColor('#cbd5e1')
     .font('Helvetica-Bold')
     .text('Platform / Tech Stack:', 50, doc.page.height * 0.80);

  doc.font('Helvetica')
     .text('Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Recharts', 180, doc.page.height * 0.80);

  doc.fillColor('#64748b')
     .fontSize(styles.fontSize.small + 1)
     .text('Generated: July 2026', 50, doc.page.height * 0.9);

  doc.addPage();
}

writeCoverPage();

// Parse Markdown Tokens using marked
const tokens = marked.lexer(markdownContent);

// Keep track of paragraph parsing status
let currentListType = null;
let currentListIndex = 1;

// Render helper for text with simple inline parsing (bold, code, links)
function formatInlineText(text) {
  // Simple regex parser for **bold** and `code` inside text
  // We can write text segment by segment to style differently
  const parts = [];
  let remaining = text;
  
  // Match bold or inline code
  const pattern = /(\*\*|`)(.*?)\1/g;
  let match;
  let lastIndex = 0;
  
  while ((match = pattern.exec(text)) !== null) {
    const plain = text.substring(lastIndex, match.index);
    if (plain) {
      parts.push({ text: plain, bold: false, code: false });
    }
    const isBold = match[1] === '**';
    parts.push({ text: match[2], bold: isBold, code: !isBold });
    lastIndex = pattern.lastIndex;
  }
  
  const plain = text.substring(lastIndex);
  if (plain) {
    parts.push({ text: plain, bold: false, code: false });
  }
  
  if (parts.length === 0) {
    parts.push({ text: text, bold: false, code: false });
  }
  
  return parts;
}

function writeInlineText(text, options = {}) {
  const parts = formatInlineText(text);
  const startX = doc.x;
  
  parts.forEach((part, index) => {
    if (part.code) {
      doc.font('Courier').fillColor('#ef4444');
    } else if (part.bold || options.bold) {
      doc.font('Helvetica-Bold').fillColor(options.color || styles.textColor);
    } else {
      doc.font('Helvetica').fillColor(options.color || styles.textColor);
    }
    
    // Add page wrap handling
    const isLast = index === parts.length - 1;
    doc.text(part.text, {
      continued: !isLast,
      align: options.align || 'left',
      lineGap: styles.lineGap
    });
  });
}

function checkPageSpace(needed) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

// Render Tokens
tokens.forEach(token => {
  // Add safety margins
  checkPageSpace(30);

  switch (token.type) {
    case 'heading': {
      const depth = token.depth;
      doc.moveDown(0.5);
      
      if (depth === 1) {
        doc.fillColor(styles.primaryColor)
           .font('Helvetica-Bold')
           .fontSize(styles.fontSize.h1)
           .text(token.text.toUpperCase(), { lineGap: 6 });
        // Add a line under H1
        doc.strokeColor(styles.primaryColor)
           .lineWidth(1.5)
           .moveTo(doc.x, doc.y - 2)
           .lineTo(doc.page.width - doc.page.margins.right, doc.y - 2)
           .stroke();
        doc.moveDown(0.4);
      } else if (depth === 2) {
        doc.fillColor(styles.darkColor)
           .font('Helvetica-Bold')
           .fontSize(styles.fontSize.h2)
           .text(token.text, { lineGap: 4 });
        doc.moveDown(0.3);
      } else {
        doc.fillColor(styles.darkColor)
           .font('Helvetica-Bold')
           .fontSize(styles.fontSize.h3)
           .text(token.text, { lineGap: 2 });
        doc.moveDown(0.2);
      }
      break;
    }
    
    case 'paragraph': {
      doc.fontSize(styles.fontSize.body);
      writeInlineText(token.text);
      doc.moveDown(0.8);
      break;
    }
    
    case 'list': {
      token.items.forEach((item, idx) => {
        checkPageSpace(20);
        doc.fontSize(styles.fontSize.body);
        
        const bullet = token.ordered ? `${idx + 1}. ` : '• ';
        doc.font('Helvetica-Bold').fillColor(styles.primaryColor);
        doc.text(bullet, { continued: true });
        
        doc.font('Helvetica').fillColor(styles.textColor);
        writeInlineText(item.text);
        doc.moveDown(0.3);
      });
      doc.moveDown(0.5);
      break;
    }
    
    case 'code': {
      const codeText = token.text;
      const lines = codeText.split('\n');
      const boxHeight = lines.length * 12 + 16;
      
      checkPageSpace(boxHeight + 20);
      
      // Draw background box
      doc.rect(doc.x, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, boxHeight)
         .fill(styles.codeBg);
         
      doc.fillColor(styles.codeColor)
         .font('Courier')
         .fontSize(styles.fontSize.body - 1);
         
      // Print text in box
      let currentY = doc.y + 8;
      lines.forEach(line => {
        doc.text(line, doc.x + 10, currentY, { lineBreak: false });
        currentY += 12;
      });
      
      doc.x = doc.page.margins.left; // Reset x
      doc.y = currentY + 8;          // Set y after box
      doc.moveDown(0.8);
      break;
    }
    
    case 'table': {
      const colCount = token.header.length;
      const tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const colWidth = tableWidth / colCount;
      
      const rowHeight = 22;
      const neededHeight = (token.rows.length + 1) * rowHeight;
      checkPageSpace(neededHeight + 20);
      
      const startX = doc.x;
      let startY = doc.y;
      
      // Render Header
      doc.font('Helvetica-Bold').fontSize(styles.fontSize.body - 1).fillColor('#ffffff');
      token.header.forEach((headerText, i) => {
        doc.rect(startX + (i * colWidth), startY, colWidth, rowHeight).fill(styles.primaryColor);
        doc.text(headerText, startX + (i * colWidth) + 6, startY + 6, { width: colWidth - 12, height: rowHeight - 8 });
      });
      
      startY += rowHeight;
      
      // Render Rows
      doc.font('Helvetica').fontSize(styles.fontSize.body - 1).fillColor(styles.textColor);
      token.rows.forEach((row, rowIndex) => {
        const isAlt = rowIndex % 2 === 1;
        row.forEach((cellText, i) => {
          doc.rect(startX + (i * colWidth), startY, colWidth, rowHeight).fill(isAlt ? '#f8fafc' : '#ffffff');
          doc.strokeColor(styles.borderColor).lineWidth(0.5).rect(startX + (i * colWidth), startY, colWidth, rowHeight).stroke();
          doc.text(cellText, startX + (i * colWidth) + 6, startY + 6, { width: colWidth - 12, height: rowHeight - 8 });
        });
        startY += rowHeight;
      });
      
      doc.y = startY + 10;
      doc.moveDown(0.5);
      break;
    }
    
    case 'hr': {
      checkPageSpace(15);
      doc.strokeColor(styles.borderColor)
         .lineWidth(1)
         .moveTo(doc.x, doc.y + 5)
         .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
         .stroke();
      doc.moveDown(1);
      break;
    }
    
    default:
      break;
  }
});

// Header and Footer Setup (buffering pages)
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  if (i === 0) continue; // Skip header/footer on cover page

  // Draw Header
  doc.fontSize(styles.fontSize.small)
     .fillColor('#94a3b8')
     .font('Helvetica')
     .text('Project LOOP — Submission Report', doc.page.margins.left, 25)
     .text('Zidio Development Internship', doc.page.width - doc.page.margins.right - 150, 25, { align: 'right' });
     
  doc.strokeColor('#e2e8f0')
     .lineWidth(0.5)
     .moveTo(doc.page.margins.left, 35)
     .lineTo(doc.page.width - doc.page.margins.right, 35)
     .stroke();

  // Draw Footer
  doc.strokeColor('#e2e8f0')
     .lineWidth(0.5)
     .moveTo(doc.page.margins.left, doc.page.height - 40)
     .lineTo(doc.page.width - doc.page.margins.right, doc.page.height - 40)
     .stroke();
     
  doc.fontSize(styles.fontSize.small)
     .fillColor('#94a3b8')
     .text(`Page ${i + 1} of ${range.count}`, doc.page.margins.left, doc.page.height - 30, { align: 'center' });
}

// End Document
doc.end();

writeStream.on('finish', () => {
  console.log(`Success! Detailed PDF project report generated successfully at:\n${pdfPath}`);
});
