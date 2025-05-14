import ReactDOM from 'react-dom'
import './index.css'
import { routes } from './router/route.tsx'
import { RouterProvider } from 'react-router-dom'
import { TranslateWrapper } from './core/services/translateService.tsx'
import { ThemeWrapper } from './core/services/themeService.tsx'
import { AuthWrapper } from './core/services/authService.tsx'

ReactDOM.render(
  <AuthWrapper>
    <TranslateWrapper>
      <ThemeWrapper>
        <RouterProvider router={routes}/>
      </ThemeWrapper>
    </TranslateWrapper>
  </AuthWrapper>,
  document.getElementById('root')

)
