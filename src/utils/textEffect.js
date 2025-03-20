export const initializeTextEffect = () => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button');
    elements.forEach(element => {
        if (!element.hasAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent || '');
        }
    });
};
