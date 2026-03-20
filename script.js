document.addEventListener('DOMContentLoaded', () => {
    // Scroll handling for Timeline Line expanding and Node revealing
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineLine = document.getElementById('timeline-line');
    const timelineEnd = document.querySelector('.timeline-end');
    
    // Create an intersection observer for the nodes
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const nodeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger reveal animation
                entry.target.classList.add('visible');
                
                // Calculate how tall the line should be (connecting visible nodes)
                updateTimelineLine();
                
                // Unobserve so it only happens once (or keep if we want reversible anims)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineNodes.forEach(node => {
        nodeObserver.observe(node);
    });

    // Update the timeline vertical line height based on scroll and visible components
    function updateTimelineLine() {
        const visibleNodes = document.querySelectorAll('.timeline-node.visible');
        if (visibleNodes.length > 0) {
            // Find the last visible node's icon
            const lastNode = visibleNodes[visibleNodes.length - 1];
            const icon = lastNode.querySelector('.node-icon');
            
            // Calculate position relative to the timeline container
            const containerBox = document.querySelector('.timeline-container').getBoundingClientRect();
            const iconBox = icon.getBoundingClientRect();
            
            // Set the height of the line to reach the middle of the last visible icon
            const targetHeight = (iconBox.top - containerBox.top) + (iconBox.height / 2);
            timelineLine.style.height = `${targetHeight}px`;
            timelineLine.style.transition = "height 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)";
            
            // If all nodes are visible, reveal the end dot and extend line to bottom
            if (visibleNodes.length === timelineNodes.length) {
                setTimeout(() => {
                    timelineLine.style.height = "100%";
                    timelineEnd.classList.add('visible');
                }, 500); // Wait a half second before extending to bottom
            }
        }
    }

    // Parallax effect for bg shapes
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelector('.bg-shape-1').style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        document.querySelector('.bg-shape-2').style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
    });
});
