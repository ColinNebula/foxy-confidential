# Git LFS (Large File Storage) Setup

This repository uses **Git LFS** to efficiently handle large binary files (images, videos) without bloating the repository size.

## 📦 What is Git LFS?

Git LFS replaces large files with tiny pointer files in Git, while storing the actual file contents on a remote server. This keeps your repository lightweight while still versioning large assets.

## 🎯 Files Tracked by LFS

The following file types are automatically tracked by Git LFS:

- **Images**: `*.png`, `*.jpg`, `*.jpeg`, `*.gif`
- **Videos**: `*.mp4`, `*.avi`, `*.mov`

Currently tracking: **28 image files** (~24MB total)

## 🚀 Setup for New Contributors

### Prerequisites

1. **Install Git LFS** (if not already installed):
   ```bash
   # Windows (using Git for Windows - already included)
   git lfs version
   
   # macOS
   brew install git-lfs
   
   # Linux (Debian/Ubuntu)
   sudo apt-get install git-lfs
   ```

2. **Initialize Git LFS** in your repository:
   ```bash
   git lfs install
   ```

### Cloning the Repository

When cloning, Git LFS files are downloaded automatically:

```bash
git clone https://github.com/ColinNebula/foxy-confidential.git
cd foxy-confidential
```

### Verifying LFS Setup

Check that LFS is working correctly:

```bash
# List all LFS-tracked files
git lfs ls-files

# Check LFS status
git lfs status

# Verify a specific file is tracked by LFS
git lfs ls-files | grep "foxy-logo.png"
```

## 📝 Working with LFS Files

### Adding New Large Files

Large files matching the tracked patterns are automatically handled by LFS:

```bash
# Add a new image (automatically tracked by LFS)
git add src/assets/images/new-image.png
git commit -m "Add new image"
```

### Manual Tracking (Optional)

To track additional file types:

```bash
# Track a new file type
git lfs track "*.psd"

# Track a specific directory
git lfs track "assets/videos/*"

# View what's being tracked
git lfs track
```

### Pulling LFS Files

When pulling changes, LFS files download automatically:

```bash
git pull
```

To manually fetch LFS files:

```bash
git lfs pull
```

## 🔍 Troubleshooting

### Issue: Files Not Downloading

**Problem**: LFS files show as pointer files instead of actual content.

**Solution**:
```bash
# Fetch all LFS files
git lfs fetch --all

# Checkout LFS files
git lfs checkout
```

### Issue: "This repository is over its data quota"

**Problem**: GitHub has LFS bandwidth/storage limits.

**Solutions**:
1. **Free accounts**: 1 GB storage, 1 GB bandwidth/month
2. **Paid accounts**: Purchase additional data packs
3. **Alternative**: Use external hosting (Cloudinary, AWS S3)

### Issue: Large Clone Times

**Problem**: Downloading all LFS files takes too long.

**Solution**: Use sparse checkout or clone without LFS initially:
```bash
# Clone without downloading LFS files
GIT_LFS_SKIP_SMUDGE=1 git clone <repo-url>

# Later, fetch only needed LFS files
git lfs pull --include="path/to/needed/files/*"
```

## 📊 LFS Statistics

View LFS usage statistics:

```bash
# Show storage usage
git lfs env

# List all tracked files with sizes
git lfs ls-files --size

# Show LFS object cache size
du -sh .git/lfs
```

## 🔧 Configuration

### `.gitattributes`

LFS tracking is configured in `.gitattributes`:

```
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.avi filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
```

### GitHub LFS Quotas

- **Free**: 1 GB storage, 1 GB bandwidth/month
- **Pro**: 2 GB storage, 2 GB bandwidth/month
- **Team**: 5 GB storage, 5 GB bandwidth/month
- **Enterprise**: Custom

Additional data packs: $5/month for 50 GB storage + 50 GB bandwidth

## 🎓 Best Practices

1. **✅ DO**: Let Git LFS handle large binary files automatically
2. **✅ DO**: Commit `.gitattributes` to ensure consistent tracking
3. **✅ DO**: Use `git lfs ls-files` to verify files are tracked
4. **✅ DO**: Optimize images before committing (use compression)
5. **❌ DON'T**: Track frequently changing large files (use external storage)
6. **❌ DON'T**: Track generated files (build artifacts, node_modules)
7. **❌ DON'T**: Commit unoptimized images (compress first)

## 🔗 Resources

- [Git LFS Official Documentation](https://git-lfs.github.com/)
- [GitHub LFS Tutorial](https://docs.github.com/en/repositories/working-with-files/managing-large-files)
- [Atlassian Git LFS Guide](https://www.atlassian.com/git/tutorials/git-lfs)

## 🆘 Need Help?

If you encounter LFS issues:

1. Check this documentation first
2. Review [Git LFS troubleshooting](https://github.com/git-lfs/git-lfs/wiki/Tutorial)
3. Contact the repository maintainer
4. Check `.git/lfs/logs/` for error details

---

**Note**: This repository was migrated to LFS on November 16, 2025. All historical commits containing large files have been rewritten to use LFS pointers.
