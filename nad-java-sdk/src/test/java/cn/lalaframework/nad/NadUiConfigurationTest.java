package cn.lalaframework.nad;

import cn.lalaframework.nad.models.Manifest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.http.HttpHeaders.CACHE_CONTROL;
import static org.springframework.http.MediaType.TEXT_HTML;

@SpringBootTest(classes = TestApplication.class)
class NadUiConfigurationTest {
    @Autowired
    private MockMvc mockMvc;

    private void assertHtml(MockHttpServletRequestBuilder requestBuilder) throws Exception {
        mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string(CACHE_CONTROL, "no-cache"))
                .andExpect(MockMvcResultMatchers.content().contentType(TEXT_HTML));
    }

    private void assertSvg(MockHttpServletRequestBuilder requestBuilder) throws Exception {
        mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string(CACHE_CONTROL, "max-age=3600"))
                .andExpect(MockMvcResultMatchers.content().contentType("image/svg+xml"));
    }

    @Test
    void nad() throws Exception {
        assertHtml(MockMvcRequestBuilders.get("/nad/"));
    }

    @Test
    void nadWithoutEndingSlash() throws Exception {
        assertHtml(MockMvcRequestBuilders.get("/nad"));
    }

    @Test
    void spa() throws Exception {
        assertHtml(MockMvcRequestBuilders.get("/nad/spa"));
    }

    @Test
    void resource() throws Exception {
        MvcResult res = mockMvc.perform(MockMvcRequestBuilders.get("/nad/asset-manifest.json"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andReturn();
        ObjectMapper mapper = new ObjectMapper();
        Manifest manifest = mapper.readValue(res.getResponse().getContentAsByteArray(), Manifest.class);
        assertNotNull(manifest);
        Map<String, String> files = manifest.getFiles();
        assertNotNull(files);

        // mockMvc.perform may throw errors, so do not use functionally style here.
        for (String path : files.values()) {
            if (!path.startsWith("/static/")) continue;
            mockMvc.perform(MockMvcRequestBuilders.get(path))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.header().string(CACHE_CONTROL, "max-age=8640000"));
        }
    }

    @Test
    void favicon() throws Exception {
        assertSvg(MockMvcRequestBuilders.get("/nad/favicon.svg"));
    }

    @Test
    void logo() throws Exception {
        assertSvg(MockMvcRequestBuilders.get("/nad/logo.svg"));
    }
}