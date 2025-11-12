You are an expert full-stack developer tasked with building a comprehensive Document Management System (DMS) using Express.js backend and React.js frontend with a microservices architecture.​

System Overview
Build an enterprise-grade DMS that handles complete document lifecycle management, collaboration, security, and workflow automation for Ethiopian organizations.​

Core Features to Implement
Document Management
Document Types & Storage:

Handle incoming, outgoing, and internal letters/documents​

Support multiple formats: PDF, DOC/DOCX, XLS/XLSX, TXT, images, videos, whiteboard formats​

Centralized document storage with organized filing system​

Unlimited storage capacity with scalable architecture​

Versioning & History:

Complete document versioning with history tracking​

Track all document revisions with timestamps​

Allow retrieval of any previous version​

Display updated versions first, but maintain access to older versions​

Document lifecycle management​

OCR & Text Extraction:

Optical Character Recognition for scanned documents​

Extract text from images and PDFs​

Index extracted content for searchability​

Metadata & Classification:

Comprehensive metadata tagging (title, type, owner, date, category, department)​

Automatic document classification using AI/ML​

Custom fields for organizational needs​

Advanced Search & Retrieval
Search Capabilities:

Full-text search across all documents and OCR content​

Keyword-based search with related results​

Multi-criteria search: title, type, owner, number, customer name, date, case, department​

Advanced filters by metadata, date ranges, document status​

Recently accessed and favorites features​

Quick Access:

Intuitive navigation with folder structures​

Matter-centric view for case-related documents​

Bookmarking and quick links​

Collaboration & Sharing
Real-Time Collaboration:

Multi-user concurrent document editing​

Document locking to prevent parallel editing conflicts​

Real-time synchronization using WebSockets​

Commenting and annotation features​

Drawing over images and photos​

Document Sharing:

Secure sharing within teams and with external stakeholders​

Pre-distribution notes and document collation​

Multiple sharing methods: email, print, export​

Granular permission controls (view, edit, download, share, admin)​

Team Workspaces:

Project-based folders and workspaces​

Department and branch-specific organization​

Collaborative task management​

Workflow & Approval Management
Workflow Automation:

Multi-level approval workflows with customizable routing​

Document review and sign-off processes​

Flexible workflow modification by authorized users​

Workflow suggestions and change requests​

Automated document management​

Notifications & Alerts:

Automated notifications for pending approvals​

Task reminders and deadline alerts​

Real-time updates via RabbitMQ message queue​

Email and in-app notifications​

Task Management:

Create and assign document-related tasks​

Track task progress and completion​

Integrated with workflow stages​

Digital Signatures
Electronic Signatures:

Built-in digital signature capabilities​

Streamlined document signing process​

Multiple signature workflows​

Signature Security:

Signature verification and authentication​

Cryptographic signing for legal compliance​

Non-repudiation features​

Security & Access Control
Authentication & Authorization:

Multi-factor authentication (2FA/MFA)​

Role-based access control (RBAC) with hierarchical roles​

User permissions and rights management​

Single sign-on (SSO) integration​

Data Protection:

256-bit AES encryption for data at rest​

SSL/TLS encryption for data in transit​

Document-level and folder-level permissions​

Virus protection and malware scanning​

Audit & Compliance:

Complete audit trails logging all document interactions​

Track who accessed what, when, and what actions were performed​

GoBD compliance for archiving​

Tamper-proof logs​

Financial audit readiness​

Access Management:

Control document access by user, role, and department​

Time-limited access tokens​

IP whitelisting and device restrictions​

Prevent unauthorized downloads​

File Upload & Download
Large File Handling:

Support files of any size using Multer with streaming​

Chunked upload for large files (no memory constraints)​

Resumable uploads - continue from where it stopped on network failure​

Real-time upload progress tracking​

Secure Downloads:

Chunked download with resume capability​

HTTP Range requests for resumable downloads​

Stream decrypted files without temp storage​

Download progress tracking​

Network Resilience:

Automatic retry on network interruption​

Session persistence for cross-session resume​

Exponential backoff for failed chunks​

Reporting & Analytics
Document Analytics:

Document usage statistics​

User activity reports​

Storage utilization metrics​

Workflow efficiency analytics​

Real-Time Dashboards:

System-wide document status view​

Track documents through approval stages​

Custom reports with auto-export, print, email​

Mobile & Accessibility
Multi-Device Access:

Responsive design for desktop, tablet, mobile​

Native mobile app capabilities​

Consistent experience across devices​

24/7 secure access from anywhere​

Offline Capabilities:

Smart sync for critical documents​

Work continues when connectivity drops​

Automatic sync when connection restored​

Integration & Compatibility
System Integration:

Seamless integration with ERP, CRM, accounting systems​

Real-time two-way data syncing​

RESTful APIs for third-party integration​

Import/export capabilities​

Compatibility:

Compatible with all computers and devices​

Scanner compatibility for document capture​

Support for various file formats​

Localization
Multi-Language Support:

Support Amharic, Oromo, and English​

Right-to-left and left-to-right text rendering​

Localized UI and conten
