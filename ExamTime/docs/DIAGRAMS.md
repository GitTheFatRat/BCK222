# 📊 SƠ ĐỒ TỔNG QUAN DỰ ÁN EXAMTIME

---

## 1. Kiến trúc Hệ thống (System Architecture)

```mermaid
graph TB
    subgraph CLIENT["🖥️ Frontend — React + Vite :5173"]
        REACT["React App<br/>(Pages + Components)"]
        REDUX["Redux Store<br/>(auth / examSession / answers)"]
        AXIOS["Axios + Interceptors"]
    end

    subgraph SERVER["⚙️ Backend — Express.js :5000"]
        MW["Middlewares<br/>(auth / admin / role / filterExam)"]
        ROUTES["Routes<br/>(auth / exams / results / admin)"]
        CTRL["Controllers<br/>(auth / exam / result / ingest)"]
        MULTER["Multer — File Upload"]
    end

    subgraph DB["🗄️ MongoDB Atlas"]
        COLLECTIONS["Users | Exams | ExamResults<br/>ListeningSets | ReadingSets<br/>WritingSets | SpeakingSets"]
    end

    STORAGE["📁 uploads/<br/>speaking/ + exams/"]

    REACT <--> REDUX
    REACT <--> AXIOS
    AXIOS <-->|"REST API<br/>JSON / FormData"| MW
    MW --> ROUTES --> CTRL
    CTRL <-->|"Mongoose"| COLLECTIONS
    CTRL --> MULTER --> STORAGE
```

---

## 2. Quan hệ Cơ sở dữ liệu (Database ERD)

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String username UK
        String email UK
        String password_hash
        String role "student | admin"
    }

    EXAM {
        ObjectId _id PK
        String title
        String code UK
        Boolean isPublished
    }

    EXAM_RESULT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId exam FK
        String skill
        String sessionId
        Mixed answers
        Object scores
        Array cheatingLog
        String status "SUBMITTED | GRADING | GRADED"
    }

    LISTENING_SET { ObjectId _id PK }
    READING_SET { ObjectId _id PK }
    WRITING_SET { ObjectId _id PK }
    SPEAKING_SET { ObjectId _id PK }

    USER ||--o{ EXAM_RESULT : "1 user — nhiều kết quả"
    EXAM ||--o{ EXAM_RESULT : "1 đề — nhiều lượt thi"
    EXAM ||--|| LISTENING_SET : "1-1"
    EXAM ||--|| READING_SET : "1-1"
    EXAM ||--|| WRITING_SET : "1-1"
    EXAM ||--|| SPEAKING_SET : "1-1"
```

---

## 3. Cây Component Frontend

```mermaid
graph TD
    ROOT["main.jsx"] --> APP["App.jsx — Routes"]

    APP --> SIDEBAR["AppSidebar"]
    APP --> LOGIN["Login"]
    APP --> REGISTER["Register"]
    APP --> HOME["HomeDashboard"]
    APP --> PRACTICE["PracticeRoom"]
    APP --> EXAM["ExamRoom"]
    APP --> RESULT["ResultSummary"]
    APP --> ADMIN_GRADE["AdminDashboard"]
    APP --> ADMIN_CHEAT["AdminCheatingLogs"]

    HOME --> EXAMCARD["ExamCard"]
    HOME --> RHISTORY["ResultHistory"]

    EXAM --> COUNTDOWN["CountdownTimer"]
    EXAM --> QSIDEBAR["Sidebar — Question Nav"]
    EXAM --> LF["ListeningForm"]
    EXAM --> RS["ReadingSplit"]
    EXAM --> WE["WritingEditor"]
    EXAM --> SR["SpeakingRecorder"]
    EXAM --> AP["AudioPlayer"]

    RS --> LF2["ListeningForm — reuse"]

    style APP fill:#16213e,color:#fff
    style EXAM fill:#e94560,color:#fff
    style HOME fill:#533483,color:#fff
    style ADMIN_GRADE fill:#e94560,color:#fff
    style ADMIN_CHEAT fill:#e94560,color:#fff
```

---

## 4. Bản đồ API Endpoints

```mermaid
graph LR
    subgraph AUTH["🔐 /api/auth"]
        A1["POST /register"]
        A2["POST /login"]
        A3["GET /me 🛡️"]
    end

    subgraph EXAMS["📝 /api/exams"]
        E1["GET /"]
        E2["GET /:code"]
    end

    subgraph RESULTS["📊 /api/results"]
        R1["POST /submit 🛡️"]
        R2["GET /me 🛡️"]
        R3["GET /admin/pending 👑"]
        R4["PUT /admin/:id/grade 👑"]
        R5["GET /admin/cheating-logs 👑"]
    end

    subgraph ADMIN["👑 /api/admin"]
        AD1["POST /ingest-exam 👑"]
    end

    style AUTH fill:#0f3460,color:#fff
    style EXAMS fill:#533483,color:#fff
    style RESULTS fill:#1a1a2e,color:#fff
    style ADMIN fill:#e94560,color:#fff
```

> 🛡️ = cần đăng nhập &nbsp;&nbsp; 👑 = cần quyền admin

---

> 💡 Để xem sơ đồ, cài extension **"Markdown Preview Mermaid Support"** trong VS Code rồi bấm `Ctrl+Shift+V`.
